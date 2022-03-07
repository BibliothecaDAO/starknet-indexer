import { InputType, Field } from 'type-graphql';
import { Desiege } from '../../entities/desiege/Desiege';

@InputType()
export class DesiegeInput implements Partial<Desiege>  {
    @Field()
    gameId: number;
    @Field()
    winner: number;
    @Field()
    attackedTokens: number;
    @Field()
    defendedTokens: number;
    @Field()
    blockIndexed: number;
}
