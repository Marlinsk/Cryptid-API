import { AggregateRoot } from '@/shared/domain/aggregate-root'

interface CryptidProps {
  name: string
  aliases: string[]
  description: string
  shortDescription: string
  originSummary: string
  physicalDescription: string | null
  behaviorNotes: string | null
  manifestationConditions: string | null
  classificationId: number
  status: string
  threatLevel: string
  createdAt: Date
}

export class Cryptid extends AggregateRoot<CryptidProps> {
  private constructor(props: CryptidProps, id: number) {
    super(props, id.toString())
  }

  get name(): string {
    return this.props.name
  }

  get aliases(): string[] {
    return this.props.aliases
  }

  get description(): string {
    return this.props.description
  }

  get shortDescription(): string {
    return this.props.shortDescription
  }

  get physicalDescription(): string | null {
    return this.props.physicalDescription
  }

  get behaviorNotes(): string | null {
    return this.props.behaviorNotes
  }

  get manifestationConditions(): string | null {
    return this.props.manifestationConditions
  }

  get classificationId(): number {
    return this.props.classificationId
  }

  get status(): string {
    return this.props.status
  }

  get threatLevel(): string {
    return this.props.threatLevel
  }

  get originSummary(): string {
    return this.props.originSummary
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(props: Omit<CryptidProps, 'createdAt'>, id: number): Cryptid {
    const cryptid = new Cryptid(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    )

    return cryptid
  }
}
