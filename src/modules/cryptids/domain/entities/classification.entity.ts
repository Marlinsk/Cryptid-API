import { Entity } from '@/shared/domain/entity'

interface ClassificationProps {
  name: string
  description: string
  categoryType: 'physical' | 'narrative' | 'abstract'
  createdAt: Date
}

export class Classification extends Entity<ClassificationProps> {
  private constructor(props: ClassificationProps, id: number) {
    super(props, id.toString())
  }

  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get categoryType(): 'physical' | 'narrative' | 'abstract' {
    return this.props.categoryType
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(
    props: Omit<ClassificationProps, 'createdAt'>,
    id: number
  ): Classification {
    const classification = new Classification(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    )

    return classification
  }
}
