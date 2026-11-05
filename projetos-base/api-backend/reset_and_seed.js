require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ MONGO_URI não encontrada nas variáveis de ambiente!');
    process.exit(1);
}

// Model Schemas
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    name: String,
    storeName: { type: String, default: '' },
    passwordResetToken: String,
    passwordResetExpires: Date
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 1000 },
    category: { type: String, required: true, maxlength: 60 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    image: { type: String, default: '' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true }
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingAddress: { type: String, required: true, maxlength: 300 }
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

// Base Users
const BASE_USERS = [
    { email: "admin@system.com", password: "AdminPassword123", role: "admin", name: "Administrador Geral" },
    { email: "user@system.com", password: "UserPassword123", role: "user", name: "Usuário Padrão" },
    { email: "blocked@system.com", password: "Blocked123", role: "blocked", name: "Usuário Bloqueado" },
    { email: "slow@system.com", password: "SlowPass123", role: "user", name: "Usuário Lento" },
    // 3 Lojistas Oficiais Variados
    { email: "lojista@system.com", password: "SellerPass123", role: "seller", name: "LojaQA Oficial", storeName: "Vitrine Tech" },
    { email: "lojistagamer@system.com", password: "SellerPass123", role: "seller", name: "Arena Gamer", storeName: "Arena Gamer Store" },
    { email: "lojistadesign@system.com", password: "SellerPass123", role: "seller", name: "Studio Pro", storeName: "Studio Pro Design" }
];

async function resetAndSeed() {
    try {
        console.log('🔄 Conectando ao MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado ao MongoDB!');

        console.log('\n🧹 Limpando produtos antigos spamados pelos testes...');
        const deleteProdResult = await Product.deleteMany({});
        console.log(`🗑️  ${deleteProdResult.deletedCount} produtos antigos removidos.`);

        console.log('\n🧹 Limpando pedidos antigos vinculados a produtos inexistentes...');
        const deleteOrderResult = await Order.deleteMany({});
        console.log(`🗑️  ${deleteOrderResult.deletedCount} pedidos antigos removidos.`);

        console.log('\n🧹 Limpando lojistas e contas de teste aleatórias criadas pelos alunos...');
        // Remove lojistas que não estão na lista de e-mails base oficial
        const officialEmails = BASE_USERS.map(u => u.email.toLowerCase());
        const deleteUsersResult = await User.deleteMany({
            role: 'seller',
            email: { $nin: officialEmails }
        });
        console.log(`🗑️  ${deleteUsersResult.deletedCount} contas de lojistas de teste removidas.`);

        // Também remove contas temporárias de alunos como aluno_... ou teste... para deixar o banco limpo
        const deleteTempUsers = await User.deleteMany({
            email: { $regex: /^(aluno_|teste|cliente_|lojista_)/i, $nin: officialEmails }
        });
        console.log(`🗑️  ${deleteTempUsers.deletedCount} contas temporárias de testes descartadas.`);

        console.log('\n👤 Garantindo usuários base oficiais...');
        const userMap = {};

        for (const u of BASE_USERS) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(u.password, salt);

            let existing = await User.findOne({ email: u.email });
            if (!existing) {
                existing = await User.create({
                    email: u.email,
                    password: hashedPassword,
                    role: u.role,
                    name: u.name,
                    storeName: u.storeName || ''
                });
                console.log(`   ✨ Criado: [${u.role}] ${u.email} (${u.storeName || u.name})`);
            } else {
                await User.updateOne(
                    { _id: existing._id },
                    {
                        $set: {
                            password: hashedPassword,
                            role: u.role,
                            name: u.name,
                            storeName: u.storeName || ''
                        }
                    }
                );
                console.log(`   🔄 Atualizado: [${u.role}] ${u.email} (${u.storeName || u.name})`);
            }
            userMap[u.email] = existing;
        }

        const vitrineTech = userMap['lojista@system.com'];
        const arenaGamer = userMap['lojistagamer@system.com'];
        const studioPro = userMap['lojistadesign@system.com'];

        console.log('\n📦 Povoando os 12 novos produtos do catálogo...');
        const NEW_PRODUCTS = [
            {
                name: 'Teclado Mecânico Aurora RGB',
                category: 'Periféricos',
                price: 289.90,
                stock: 18,
                sellerId: vitrineTech._id,
                description: 'Switches mecânicos silenciosos, iluminação RGB discreta e cabo trançado reforçado.',
                image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Mouse Óptico Atlas Pro 16000 DPI',
                category: 'Periféricos',
                price: 149.90,
                stock: 35,
                sellerId: vitrineTech._id,
                description: 'Sensor óptico de alta precisão, peso ajustável e botões laterais programáveis para produtividade e jogos.',
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Headset Gamer Nexo 7.1 Surround',
                category: 'Áudio',
                price: 219.90,
                stock: 14,
                sellerId: arenaGamer._id,
                description: 'Áudio imersivo com cancelamento de ruído passivo, drivers de 50mm e microfone retrátil de alta sensibilidade.',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Monitor Gamer Curvo UltraWide 29" IPS',
                category: 'Monitores',
                price: 1399.00,
                stock: 8,
                sellerId: arenaGamer._id,
                description: 'Resolução Full HD UltraWide (2560x1080), 75Hz, tempo de resposta 1ms e suporte a HDR10.',
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Microfone Condensador USB Podcast Studio',
                category: 'Áudio',
                price: 329.90,
                stock: 10,
                sellerId: studioPro._id,
                description: 'Captação cardioide cristalina, filtro pop-filter integrado, suporte antichoque e conexão USB plug-and-play.',
                image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Webcam StreamCam 1080p 60FPS Full HD',
                category: 'Acessórios',
                price: 399.90,
                stock: 4, // Estoque baixo (<5) para validar teste de alerta amarelo!
                sellerId: studioPro._id,
                description: 'Foco automático inteligente com rastreamento facial, microfone estéreo duplo e clipe versátil para monitores e tripés.',
                image: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Cadeira Ergonômica Mesh ErgoTech',
                category: 'Cadeiras & Ergonomia',
                price: 899.90,
                stock: 6,
                sellerId: studioPro._id,
                description: 'Encosto em malha respirável, suporte lombar dinâmico ajustável, braços 3D e pistão a gás classe 4.',
                image: 'https://images.unsplash.com/photo-1580481077194-e3c6a46f2c01?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'SSD NVMe M.2 1TB Gen4 UltraSpeed',
                category: 'Hardware & Armazenamento',
                price: 449.90,
                stock: 20,
                sellerId: vitrineTech._id,
                description: 'Velocidades de leitura de até 7000 MB/s, dissipador térmico em alumínio grafeno e garantia de alta durabilidade.',
                image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Mousepad Gamer Speed Extra Grande (90x40cm)',
                category: 'Acessórios',
                price: 79.90,
                stock: 50,
                sellerId: arenaGamer._id,
                description: 'Superfície de microfibra de baixo atrito, bordas costuradas de alta densidade e base emborrachada antiderrapante.',
                image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Suporte Articulado a Gás para 2 Monitores',
                category: 'Cadeiras & Ergonomia',
                price: 269.90,
                stock: 0, // Esgotado propositalmente para validar teste de produto sem estoque / badge vermelha!
                sellerId: vitrineTech._id,
                description: 'Pistão a gás para ajuste suave de altura, inclinação e rotação 360°, padrão VESA 75/100 para telas de 17" a 32".',
                image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Caixa de Som Soundbar Desktop RGB Bluetooth',
                category: 'Áudio',
                price: 169.90,
                stock: 15,
                sellerId: arenaGamer._id,
                description: 'Potência de 20W RMS com graves aprimorados, conexão Bluetooth 5.3 e iluminação RGB dinâmica ao ritmo do som.',
                image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
                active: true
            },
            {
                name: 'Hub Adaptador USB-C 8 em 1 4K HDMI PD 100W',
                category: 'Acessórios',
                price: 189.90,
                stock: 22,
                sellerId: studioPro._id,
                description: 'Saída HDMI 4K@60Hz, leitor de cartões SD/microSD, 3 portas USB 3.0 e porta de carregamento Power Delivery 100W.',
                image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80',
                active: true
            }
        ];

        const inserted = await Product.insertMany(NEW_PRODUCTS);
        console.log(`✅ ${inserted.length} novos produtos cadastrados com sucesso!`);

        console.log('\n📊 Resumo do Novo Catálogo:');
        inserted.forEach(p => {
            console.log(` - [${p.category}] ${p.name} | R$ ${p.price.toFixed(2)} | Estoque: ${p.stock} un`);
        });

        console.log('\n🎉 BANCO DE DADOS LIMPO E POVOADO COM SUCESSO!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Erro no reset & seed:', err);
        process.exit(1);
    }
}

resetAndSeed();

