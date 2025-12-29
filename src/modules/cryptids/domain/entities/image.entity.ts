import { Entity } from '@/shared/domain/entity'

interface ImageProps {
  cryptidId: number
  url: string
  altText: string
  source: string
  createdAt: Date
}

export class Image extends Entity<ImageProps> {
  private constructor(props: ImageProps, id: number) {
    super(props, id.toString())
  }

  get cryptidId(): number {
    return this.props.cryptidId
  }

  get url(): string {
    return this.props.url
  }

  get altText(): string {
    return this.props.altText
  }

  get source(): string {
    return this.props.source
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(props: Omit<ImageProps, 'createdAt'>, id: number): Image {
    const image = new Image(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    )

    return image
  }
}
