const bcrypt = require('bcryptjs');
const { initSystemDB, getSystemDB, getSchoolDB } = require('./db');

// Initialize system DB first
initSystemDB();
const db = getSystemDB();

async function seed() {
    console.log('🌱 Starting database seeding...\n');

    // 1. Create Super Admin
    const adminEmail = 'admin@edufocus.com';
    const adminPassword = 'admin123';

    try {
        const existingAdmin = db.prepare('SELECT * FROM super_admins WHERE email = ?').get(adminEmail);
        if (!existingAdmin) {
            const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
            db.prepare('INSERT INTO super_admins (email, password) VALUES (?, ?)').run(adminEmail, hashedAdminPassword);
            console.log('✅ Super Admin created:');
            console.log('   Email: admin@edufocus.com');
            console.log('   Password: admin123\n');
        } else {
            console.log('ℹ️  Super Admin already exists\n');
        }
    } catch (err) {
        console.error('Error creating Super Admin:', err);
    }

    // 2. Create Test Schools and Classes
    const schools = [
        { name: 'Escola Municipal São Paulo', admin_name: 'Maria Silva', email: 'escola1@test.com', address: 'Rua A, 123 - São Paulo, SP' },
        { name: 'Colégio Estadual Rio de Janeiro', admin_name: 'João Santos', email: 'escola2@test.com', address: 'Av. B, 456 - Rio de Janeiro, RJ' }
    ];

    for (const school of schools) {
        let schoolId;
        try {
            const existing = db.prepare('SELECT * FROM schools WHERE email = ?').get(school.email);

            if (!existing) {
                const hashedPassword = await bcrypt.hash('escola123', 10);
                const info = db.prepare('INSERT INTO schools (name, admin_name, email, password, address) VALUES (?, ?, ?, ?, ?)').run(
                    school.name, school.admin_name, school.email, hashedPassword, school.address
                );
                schoolId = info.lastInsertRowid;
                console.log(`✅ School created: ${school.name}`);
            } else {
                schoolId = existing.id;
                console.log(`ℹ️  School already exists: ${school.name}`);
            }

            // Initialize school database and create classes
            if (schoolId) {
                const schoolDB = getSchoolDB(schoolId);

                // Ensure classes table exists
                schoolDB.prepare(`
                    CREATE TABLE IF NOT EXISTS classes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL
                    )
                `).run();

                const classes = ['3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano'];
                for (const className of classes) {
                    const existingClass = schoolDB.prepare('SELECT * FROM classes WHERE name = ?').get(className);
                    if (!existingClass) {
                        schoolDB.prepare('INSERT INTO classes (name) VALUES (?)').run(className);
                        console.log(`   📚 Class created: ${className} for ${school.name}`);
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing school ${school.name}:`, err);
        }
    }

    // 3. Create Test Teachers
    const teachers = [
        { name: 'Prof. Ana Costa', email: 'prof1@test.com', subject: 'Matemática' },
        { name: 'Prof. Carlos Lima', email: 'prof2@test.com', subject: 'Português' },
        { name: 'Prof. Beatriz Souza', email: 'prof3@test.com', subject: 'Ciências' }
    ];

    for (const teacher of teachers) {
        try {
            const existing = db.prepare('SELECT * FROM teachers WHERE email = ?').get(teacher.email);
            if (!existing) {
                const hashedPassword = await bcrypt.hash('prof123', 10);
                db.prepare('INSERT INTO teachers (name, email, password, subject) VALUES (?, ?, ?, ?)').run(
                    teacher.name, teacher.email, hashedPassword, teacher.subject
                );
                console.log(`✅ Teacher created: ${teacher.name}`);
            }
        } catch (err) {
            console.error(`Error creating teacher ${teacher.name}:`, err);
        }
    }

    // 4. Create Test Representatives
    const representatives = [
        { name: 'Rep. Pedro Oliveira', email: 'rep1@test.com', commission_rate: 10.0 },
        { name: 'Rep. Lucia Ferreira', email: 'rep2@test.com', commission_rate: 12.5 }
    ];

    for (const rep of representatives) {
        try {
            const existing = db.prepare('SELECT * FROM representatives WHERE email = ?').get(rep.email);
            if (!existing) {
                const hashedPassword = await bcrypt.hash('rep123', 10);
                db.prepare('INSERT INTO representatives (name, email, password, commission_rate) VALUES (?, ?, ?, ?)').run(
                    rep.name, rep.email, hashedPassword, rep.commission_rate
                );
                console.log(`✅ Representative created: ${rep.name}`);
            }
        } catch (err) {
            console.error(`Error creating representative ${rep.name}:`, err);
        }
    }

    // 5. Create Test Technicians
    const technicians = [
        { name: 'Téc. Roberto Silva', email: 'tec1@test.com', phone: '(11) 98765-4321' },
        { name: 'Téc. Fernanda Costa', email: 'tec2@test.com', phone: '(21) 98765-1234' }
    ];

    for (const tech of technicians) {
        try {
            const existing = db.prepare('SELECT * FROM technicians WHERE email = ?').get(tech.email);
            if (!existing) {
                const hashedPassword = await bcrypt.hash('tec123', 10);
                db.prepare('INSERT INTO technicians (name, email, password, phone) VALUES (?, ?, ?, ?)').run(
                    tech.name, tech.email, hashedPassword, tech.phone
                );
                console.log(`✅ Technician created: ${tech.name}`);
            }
        } catch (err) {
            console.error(`Error creating technician ${tech.name}:`, err);
        }
    }

    console.log('🎉 Database seeding completed!\n');
}

module.exports = { seed };
