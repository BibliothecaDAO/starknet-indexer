import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';
import { Wallet } from './Wallet';

@ObjectType({ description: 'The Realm Model' })
export class Realm {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  realmId!: number;

  @Field({ nullable: true })
  name!: string;

  @Field({ nullable: true })
  owner!: string;

  @Field(() => Wallet, { nullable: false })
  wallet!: Wallet;
}

