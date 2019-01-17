module.exports = {
  insertOne (db, collection, query) {
    return new Promise((resolve, reject) => {
      db.collection(collection).insertOne(query, (err) => {
        if (err) reject(new Error(err))
        else resolve(query._id)
      })
    })
  },

  insertMany (db, collection, array) {
    return new Promise((resolve, reject) => {
      db.collection(collection).insertMany(array, (err) => {
        if (err) reject(new Error(err))
        else resolve(array.map(obj => obj._id))
      })
    })
  },
  removeOne (db, collection, query) {
    return new Promise((resolve, reject) => {
      db.collection(collection).deleteOne(query, (err) => {
        if (err) reject(new Error(err))
        else resolve(query._id)
      })
    })
  },

  remove (db, collection, query) {
    return new Promise((resolve, reject) => {
      db.collection(collection).deleteMany(query, (err) => {
        if (err) reject(new Error(err))
        else resolve(query._id)
      })
    })
  },

  findOne (db, collection, query) {
    return new Promise((resolve, reject) => {
      db.collection(collection).findOne(query, (err, result) => {
        if (err) reject(new Error(err))
        else resolve(result)
      })
    })
  },

  find (db, collection, query, options) {
    return new Promise((resolve, reject) => {
      db.collection(collection).find(query, options).toArray((err, result) => {
        if (err) reject(new Error(err))
        else resolve(result)
      })
    })
  },

  findArrayOfElement (db, collection, query, element) {
    return new Promise((resolve, reject) => {
      db.collection(collection).aggregate([
        { $match: query },
        { $project: { [element]: 1, _id: 0 }
        }
      ]).toArray((err, result) => {
        if (err) reject(new Error(err))
        else resolve(result.map(obj => obj[element]))
      })
    })
  },
  findOneElement (db, collection, query, element) {
    return new Promise((resolve, reject) => {
      db.collection(collection).aggregate([
        { $match: query },
        { $project: { _id: 0, [element]: 1 }
        }
      ]).toArray((err, result) => {
        if (err) reject(new Error(err))
        else resolve((result[0] || {})[element])
      })
    })
  },
  findElements (db, collection, query, elements) {
    const map = elements.reduce((map, str) => ({ ...map, [str]: 1 }), {})
    return new Promise((resolve, reject) => {
      db.collection(collection).aggregate([
        { $match: query },
        { $project: { _id: 0, ...map } }
      ]).toArray((err, result) => {
        if (err) reject(new Error(err))
        else resolve(result[0])
      })
    })
  },
  async findNew (db, collection, query, limit) {
    let options = {}
    return new Promise((resolve, reject) => {
      db.collection(collection).find(query, options)
        .sort({ createdAt: -1 }).limit(Number(limit)).sort({ createdAt: 1 }).toArray((err, result) => {
          if (err) reject(new Error(err))
          else resolve(result)
        })
    })
  },

  updateOne (db, collection, query, data) {
    return new Promise((resolve, reject) => {
      db.collection(collection).updateOne(query, data, (err, result) => {
        if (err) reject(new Error(err))
        else resolve(result)
      })
    })
  },

  updateMany (db, collection, query, data) {
    return new Promise((resolve, reject) => {
      db.collection(collection).updateMany(query, data, (err, result) => {
        if (err) reject(new Error(err))
        else resolve(result)
      })
    })
  },
  getFileList (db, query, isContent, isDetails) {
    return new Promise((resolve, reject) => {
      const $project = {
        _id: 1,
        name: 1,
        type: 1,
        size: 1,
        createdAt: 1
      }
      if (isContent) {
        $project.url = 1
        $project.width = 1
        $project.height = 1
        $project.data = 1
      }
      db.collection('files').aggregate([
        { $match: query },
        { $project }
      ]).toArray((err, result) => {
        if (err) reject(new Error(err))
        else resolve(result)
      })
    })
  },

  getGroupList (db, query) {
    return new Promise((resolve, reject) => {
      db.collection('groups').aggregate([
        { $match: query },
        { $project: {
          _id: 1,
          name: 1,
          acronym: 1,
          image: 1
        }
        }
      ]).toArray((err, result) => {
        if (err) reject(new Error(err))
        else resolve(result)
      })
    })
  },
  getPostLog (db, query) {
    return new Promise((resolve, reject) => {
      db.collection('posts').aggregate([
        { $match: query },
        { $project: {
          _id: 1,
          title: 1,
          content: 1
        }
        }
      ]).toArray((err, array) => {
        if (err) reject(new Error(err))
        else resolve(array[0])
      })
    })
  }

}
