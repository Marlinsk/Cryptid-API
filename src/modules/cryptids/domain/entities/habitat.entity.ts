import { Entity } from '@/shared/domain/entity'

interface HabitatProps {
  name: string
  description: string
  isPhysical: boolean
  createdAt: Date
  updatedAt: Date
}

export class Habitat extends Entity<HabitatProps> {
  private constructor(props: HabitatProps, id: number) {
    super(props, id.toString())
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get isPhysical(): boolean {
    return this.props.isPhysical
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  public static create(props: Omit<HabitatProps, 'createdAt' | 'updatedAt'>, id: number): Habitat {
    const habitat = new Habitat(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    )

    return habitat
  }
}
