import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';

@ObjectType({ description: 'The Desiege Model' })
export class Desiege {
    @Field(() => ID)
    id: number;
    @Field()
    gameId: number;
    @Field()
    winner: number;
    @Field()
    attackedTokens: number;
    @Field()
    defendedTokens: number;
    @Field()
    totalDamage: number;
    @Field()
    totalShieldBoost: number;
}

