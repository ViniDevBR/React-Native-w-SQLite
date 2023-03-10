import { db } from './SQLiteDataBase'

export interface ICar {
  id: string
  brand: string
  model: string
  hp: number
}
/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
db.transaction((tx) => {
  //USE ISSO APENAS DURANTE OS TESTES!!!
  // tx.executeSql('DROP TABLE cars;')

  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY, brand TEXT, model TEXT, hp INT);'
  )
})


/**
 * CRIAÇÃO DE UM NOVO REGISTRO
 * - Recebe um objeto;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
 *  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
 */
export function create(obj: ICar) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //comando SQL modificável
      tx.executeSql(
        'INSERT INTO cars (brand, model, hp) values (?, ?, ?);',
        [obj.brand, obj.model, obj.hp],
        //-----------------------
        (_, { rowsAffected, insertId }) => rowsAffected > 0 ? resolve(insertId) : reject(
          'Error inserting obj: ' + JSON.stringify(obj)
        ),
        // insert falhou
        (_, error) => (reject(error), false) // erro interno em tx.executeSql
      )
    })
  })
}

/**
 * ATUALIZA UM REGISTRO JÁ EXISTENTE
 * - Recebe o ID do registro e um OBJETO com valores atualizados;
 * - Retorna uma Promise:
 *  - O resultado da Promise é a quantidade de registros atualizados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
export function update(id: ICar['id'], obj: ICar) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //comando SQL modificável
      tx.executeSql(
        'UPDATE cars SET brand=?, model=?, hp=? WHERE id=?;',
        [obj.brand, obj.model, obj.hp, id],
        //-----------------------
        (_, { rowsAffected }) => rowsAffected > 0 ? resolve(rowsAffected) : reject(
          'Error updating obj: id=' + id
        ),
        // nenhum registro alterado
        (_, error) => (reject(error), false) // erro interno em tx.executeSql
      )
    })
  })
}

/**
 * BUSCA UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o objeto (caso exista);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
export function find(id: ICar['id']) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //comando SQL modificável
      tx.executeSql(
        'SELECT * FROM cars WHERE id=?;',
        [id],
        //-----------------------
        (_, { rows }) => rows.length > 0 ? resolve(rows._array[0]) : reject('Obj not found: id=' + id),
        // nenhum registro encontrado
        (_, error) => (reject(error), true) // erro interno em tx.executeSql
      )
    })
  })
}

/**
 * BUSCA UM REGISTRO POR MEIO DA MARCA (brand)
 * - Recebe a marca do carro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é um array com os objetos encontrados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso nenhum objeto seja encontrado.
 */
export function findByBrand (brand: ICar['brand']) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //comando SQL modificável
      tx.executeSql(
        'SELECT * FROM cars WHERE brand LIKE ?;',
        [brand],
        //-----------------------
        (_, { rows }) => rows.length > 0 ? resolve(rows._array) : reject('Obj not found: brand=' + brand),
        //nenhum registro encontrado
        (_, error) => (reject(error), true) // erro interno em tx.executeSql
      )
    })
  })
}

/**
 * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
 * - Não recebe parâmetros;
 * - Retorna uma Promise:
 *  - O resultado da Promise é uma lista (Array) de objetos;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso não existam registros.
 */
export function all() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //comando SQL modificável
      tx.executeSql(
        'SELECT * FROM cars;',
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => (reject(error), true) // erro interno em tx.executeSql
      )
    })
  })
}

/**
 * REMOVE UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
export function remove(id: ICar['id']) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //comando SQL modificável
      tx.executeSql(
        'DELETE FROM cars WHERE id=?;',
        [id],
        //-----------------------
        (_, { rowsAffected }) => resolve(rowsAffected),
        (_, error) => (reject(error), true) // erro interno em tx.executeSql
      )
    })
  })
}
