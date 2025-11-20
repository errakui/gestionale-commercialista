import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class AddCampiFiscali1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Aggiungi campi fiscali alla tabella clienti
    await queryRunner.addColumn(
      'clienti',
      new TableColumn({
        name: 'esente_iva',
        type: 'tinyint',
        default: 0,
      })
    );

    await queryRunner.addColumn(
      'clienti',
      new TableColumn({
        name: 'soggetto_iva',
        type: 'tinyint',
        default: 1,
      })
    );

    await queryRunner.addColumn(
      'clienti',
      new TableColumn({
        name: 'aliquota_iva',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 22.00,
      })
    );

    await queryRunner.addColumn(
      'clienti',
      new TableColumn({
        name: 'esente_ritenuta',
        type: 'tinyint',
        default: 0,
      })
    );

    await queryRunner.addColumn(
      'clienti',
      new TableColumn({
        name: 'soggetto_ritenuta',
        type: 'tinyint',
        default: 0,
      })
    );

    await queryRunner.addColumn(
      'clienti',
      new TableColumn({
        name: 'aliquota_ritenuta',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 20.00,
      })
    );

    // Aggiungi campi fiscali alla tabella movimenti_cassa
    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'imponibile',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'importo_iva',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'aliquota_iva',
        type: 'decimal',
        precision: 5,
        scale: 2,
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'importo_ritenuta',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'aliquota_ritenuta',
        type: 'decimal',
        precision: 5,
        scale: 2,
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'non_imponibile',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      'movimenti_cassa',
      new TableColumn({
        name: 'spesa_interna',
        type: 'tinyint',
        default: 0,
      })
    );

    // Crea tabella servizi_predefiniti
    await queryRunner.createTable(
      new Table({
        name: 'servizi_predefiniti',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'descrizione',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'importo',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'categoria',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'attivo',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'applica_iva',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'aliquota_iva',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 22.00,
          },
          {
            name: 'applica_ritenuta',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'aliquota_ritenuta',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 20.00,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rimuovi campi fiscali dalla tabella clienti
    await queryRunner.dropColumn('clienti', 'esente_iva');
    await queryRunner.dropColumn('clienti', 'soggetto_iva');
    await queryRunner.dropColumn('clienti', 'aliquota_iva');
    await queryRunner.dropColumn('clienti', 'esente_ritenuta');
    await queryRunner.dropColumn('clienti', 'soggetto_ritenuta');
    await queryRunner.dropColumn('clienti', 'aliquota_ritenuta');

    // Rimuovi campi fiscali dalla tabella movimenti_cassa
    await queryRunner.dropColumn('movimenti_cassa', 'imponibile');
    await queryRunner.dropColumn('movimenti_cassa', 'importo_iva');
    await queryRunner.dropColumn('movimenti_cassa', 'aliquota_iva');
    await queryRunner.dropColumn('movimenti_cassa', 'importo_ritenuta');
    await queryRunner.dropColumn('movimenti_cassa', 'aliquota_ritenuta');
    await queryRunner.dropColumn('movimenti_cassa', 'non_imponibile');
    await queryRunner.dropColumn('movimenti_cassa', 'spesa_interna');

    // Rimuovi tabella servizi_predefiniti
    await queryRunner.dropTable('servizi_predefiniti');
  }
}

