import { Entity } from '@/shared/domain/entity'

interface RealmProps {
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export class Realm extends Entity<RealmProps> {
  private constructor(props: RealmProps, id: number) {
    super(props, id.toString())
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  public static create(props: Omit<RealmProps, 'createdAt' | 'updatedAt'>, id: number): Realm {
    const realm = new Realm(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    )

    return realm
  }
}
