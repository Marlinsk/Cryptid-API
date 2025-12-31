import { Entity } from '@/shared/domain/entity'

interface ImageProps {
  cryptidId: number
  url: string
  size: string
  altText: string
  source: string
  license: string
  createdAt: Date
}

export class Image extends Entity<ImageProps> {
  private constructor(props: ImageProps, id: string) {
    super(props, id)
  }

  get cryptidId(): number {
    return this.props.cryptidId
  }

  get url(): string {
    return this.props.url
  }

  get size(): string {
    return this.props.size
  }

  get altText(): string {
    return this.props.altText
  }

  get source(): string {
    return this.props.source
  }

  get license(): string {
    return this.props.license
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  public static create(props: Omit<ImageProps, 'createdAt'>, id: string): Image {
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
