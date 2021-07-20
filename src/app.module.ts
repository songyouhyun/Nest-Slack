import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middlewares';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspace/workspace.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { WorkspaceController } from './workspace/workspace.controller';
import { WorkspaceService } from './workspace/workspace.service';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, WorkspacesModule, ChannelsModule, DmsModule],
  controllers: [AppController, WorkspaceController],
  providers: [AppService, WorkspaceService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
