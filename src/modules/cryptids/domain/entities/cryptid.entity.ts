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
  timelineSummary: string | null
  containmentNotes: string | null
  classificationId: number
  realmId: number
  habitatId: number
  status: string
  threatLevel: string
  firstReportedAt: Date | null
  lastReportedAt: Date | null
  createdAt: Date
  updatedAt: Date
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

  get timelineSummary(): string | null {
    return this.props.timelineSummary
  }

  get containmentNotes(): string | null {
    return this.props.containmentNotes
  }

  get classificationId(): number {
    return this.props.classificationId
  }

  get realmId(): number {
    return this.props.realmId
  }

  get habitatId(): number {
    return this.props.habitatId
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

  get firstReportedAt(): Date | null {
    return this.props.firstReportedAt
  }

  get lastReportedAt(): Date | null {
    return this.props.lastReportedAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  public static create(props: Omit<CryptidProps, 'createdAt' | 'updatedAt'>, id: number): Cryptid {
    const cryptid = new Cryptid(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id
    )

    return cryptid
  }
}
