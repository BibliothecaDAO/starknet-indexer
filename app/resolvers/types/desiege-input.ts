import { InputType, Field } from 'type-graphql';
// import { Desiege } from '../../entities/Desiege';

@InputType()
export class DesiegeInput {
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
