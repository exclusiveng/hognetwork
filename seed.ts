import { AppDataSource } from './src/config/data-source';
import { User, UserRole } from './src/entities/user.entity';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database synced successfully due to synchronize: true.');

    const userRepo = AppDataSource.getRepository(User);
    const adminExists = await userRepo.count() > 0;
    
    if (adminExists) {
      console.log('Admin already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = userRepo.create({
        name: 'Test Admin',
        email: 'admin@test.com',
        passwordHash: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });
      await userRepo.save(admin);
      console.log('Test admin created successfully: admin@test.com / admin123');
    }
    
    await AppDataSource.destroy();
  } catch (err) {
    console.error('Error seeding DB:', err);
  }
}

seed();
