import { ObjectType, Field, ID } from 'type-graphql';
import { __Type } from 'graphql';

@ObjectType({ description: 'The Resource Model' })
export class Resource {
    @Field(() => ID)
    id: number

    @Field({ nullable: false })
    realmId: number;

    @Field({ nullable: true })
    resourceId!: number;

    @Field({ nullable: true })
    resourceName!: string;
}

