import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';
import { Wallet } from '../wallet/Wallet';
import { Squad } from './Squad'
import { Buildings } from './Buildings';
import { Resource } from './Resource';

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

  @Field(() => Squad, { nullable: true })
  offenceSquad!: Squad;

  @Field(() => Squad, { nullable: true })
  defenceSquad!: Squad;

  @Field(() => Buildings, { nullable: true })
  buildings!: Buildings;

  @Field(() => [Resource], { nullable: true })
  resources!: [Resource];
}

