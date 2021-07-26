import { Factory, Seeder } from 'typeorm-seeding';
import { Workspaces } from '../../entities/Workspaces';
import { Connection } from 'typeorm';
import { Channels } from '../../entities/Channels';

export class createInitialData implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<any> {
    // workspace 만들고, 하나밖에 안들어갔으니 WorkspaceId가 1이다.
    // 그리고 그 WorkspaceId가 1인 Workspace안에 기본 채널을 넣음
    // 이것이 초기데이터를 넣어주는 seeding 작업
    await connection
      .createQueryBuilder()
      .insert()
      .into(Workspaces)
      .values([{ id: 1, name: 'Slcak', url: 'slack' }])
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into(Channels)
      .values([{ id: 1, name: 'Slcak', WorkspaceId: 1, private: false }])
      .execute();
  }
}
