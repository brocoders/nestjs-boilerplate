import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MessageEntity } from '../entities/message.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Message } from '../../../../domain/message';
import { MessageRepository } from '../../message.repository';
import { MessageMapper } from '../mappers/message.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MessageRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);
    const newEntity = await this.messageRepository.save(
      this.messageRepository.create(persistenceModel),
    );
    return MessageMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Message[]> {
    const entities = await this.messageRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async findById(id: Message['id']): Promise<NullableType<Message>> {
    const entity = await this.messageRepository.findOne({
      where: { id },
    });

    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Message['id'][]): Promise<Message[]> {
    const entities = await this.messageRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const entity = await this.messageRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.messageRepository.save(
      this.messageRepository.create(
        MessageMapper.toPersistence({
          ...MessageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MessageMapper.toDomain(updatedEntity);
  }

  async remove(id: Message['id']): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
