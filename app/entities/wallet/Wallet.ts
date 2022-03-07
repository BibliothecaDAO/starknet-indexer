import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';
import { Realm } from '../settling/Realm';

@ObjectType({ description: 'The Wallet Model' })
export class Wallet {
    @Field(() => ID)
    id: number

    @Field()
    address: string;

    @Field(() => [Realm], { nullable: false })
    realms!: [Realm]
}

