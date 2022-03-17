import { InputType, Field } from 'type-graphql';
import { __Type } from 'graphql';

@InputType()
export class ResourceInput {
    @Field({ nullable: false })
    realmId: number;

    @Field({ nullable: true })
    resourceId!: number;

    @Field({ nullable: true })
    resourceName!: string;
}

