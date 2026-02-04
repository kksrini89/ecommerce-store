import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    StoreModule,
    AuthModule, // Exports JwtModule for other modules
    UsersModule, // Can now use JwtService from AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
