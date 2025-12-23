import { Entity } from './entity'

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: unknown[] = []

  get domainEvents(): unknown[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: unknown): void {
    this._domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this._domainEvents = []
  }
}
