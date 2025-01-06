import { Module } from '@nestjs/common';
import { SecretFlagsService } from './secret-flags.service';
import { SecretFlagsResolver } from './secret-flags.resolver';

@Module({
  providers: [SecretFlagsService, SecretFlagsResolver]
})
export class SecretFlagsModule {}
