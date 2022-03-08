import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';

@ObjectType({ description: 'The Buildings Model' })
export class Buildings {
    @Field(() => ID)
    id: number

    @Field({ nullable: false })
    realmId: number;

    @Field({ nullable: true })
    barracks!: number;
}

