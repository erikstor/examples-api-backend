# Ejemplos CRUD con NoSQL (MongoDB)

Este directorio contiene ejemplos completos de operaciones CRUD usando MongoDB, incluyendo scripts de base de datos, agregaciones, índices y ejemplos de uso con diferentes drivers.

## 🚀 Características

- **Base de datos**: MongoDB 6.0+
- **Drivers**: Node.js, Python, Go, Java
- **Agregaciones**: Pipeline de MongoDB
- **Índices**: Optimización de consultas
- **Validación**: Esquemas y validadores
- **Seguridad**: Autenticación y autorización
- **Backup**: Scripts de respaldo y restauración
- **Sharding**: Configuración de distribución

## 📋 Prerrequisitos

- MongoDB 6.0 o superior
- MongoDB Compass (opcional, para interfaz gráfica)
- Node.js, Python, Go, Java (según el driver)
- Git

## 🛠️ Instalación

### 1. Instalar MongoDB

#### Windows
```bash
# Descargar MongoDB Community Server desde:
# https://www.mongodb.com/try/download/community
```

#### macOS
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ubuntu/Debian
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Agregar repositorio
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Instalar MongoDB
sudo apt update
sudo apt install mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Configurar MongoDB
```bash
# Conectar a MongoDB
mongosh

# Crear base de datos
use crud_example

# Crear usuario administrador
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})
```

## 📁 Estructura del proyecto

```
nosql/
├── README.md                    # Documentación principal
├── database/
│   ├── schema.js               # Esquema de la base de datos
│   ├── data.js                 # Datos de ejemplo
│   └── indexes.js              # Índices para optimización
├── nodejs/
│   ├── package.json            # Dependencias de Node.js
│   ├── config/
│   │   └── database.js         # Configuración de conexión
│   ├── models/
│   │   ├── user.js             # Modelo de usuario
│   │   ├── product.js          # Modelo de producto
│   │   └── order.js            # Modelo de orden
│   ├── controllers/
│   │   ├── userController.js   # Controlador de usuarios
│   │   ├── productController.js # Controlador de productos
│   │   └── orderController.js  # Controlador de órdenes
│   ├── routes/
│   │   ├── userRoutes.js       # Rutas de usuarios
│   │   ├── productRoutes.js    # Rutas de productos
│   │   └── orderRoutes.js      # Rutas de órdenes
│   ├── middleware/
│   │   ├── auth.js             # Middleware de autenticación
│   │   └── validation.js       # Middleware de validación
│   ├── utils/
│   │   ├── jwt.js              # Utilidades de JWT
│   │   └── password.js         # Utilidades de hash
│   ├── tests/
│   │   ├── user.test.js        # Tests de usuarios
│   │   ├── product.test.js     # Tests de productos
│   │   └── order.test.js       # Tests de órdenes
│   └── server.js               # Servidor principal
├── python/
│   ├── requirements.txt        # Dependencias de Python
│   ├── config/
│   │   └── database.py         # Configuración de conexión
│   ├── models/
│   │   ├── user.py             # Modelo de usuario
│   │   ├── product.py          # Modelo de producto
│   │   └── order.py            # Modelo de orden
│   ├── controllers/
│   │   ├── user_controller.py  # Controlador de usuarios
│   │   ├── product_controller.py # Controlador de productos
│   │   └── order_controller.py # Controlador de órdenes
│   ├── routes/
│   │   ├── user_routes.py      # Rutas de usuarios
│   │   ├── product_routes.py   # Rutas de productos
│   │   └── order_routes.py     # Rutas de órdenes
│   ├── middleware/
│   │   ├── auth.py             # Middleware de autenticación
│   │   └── validation.py       # Middleware de validación
│   ├── utils/
│   │   ├── jwt_utils.py        # Utilidades de JWT
│   │   └── password_utils.py   # Utilidades de hash
│   ├── tests/
│   │   ├── test_users.py       # Tests de usuarios
│   │   ├── test_products.py    # Tests de productos
│   │   └── test_orders.py      # Tests de órdenes
│   └── app.py                  # Aplicación principal
├── golang/
│   ├── go.mod                  # Dependencias de Go
│   ├── config/
│   │   └── database.go         # Configuración de conexión
│   ├── models/
│   │   ├── user.go             # Modelo de usuario
│   │   ├── product.go          # Modelo de producto
│   │   └── order.go            # Modelo de orden
│   ├── handlers/
│   │   ├── user_handler.go     # Handler de usuarios
│   │   ├── product_handler.go  # Handler de productos
│   │   └── order_handler.go    # Handler de órdenes
│   ├── middleware/
│   │   ├── auth.go             # Middleware de autenticación
│   │   └── validation.go       # Middleware de validación
│   ├── utils/
│   │   ├── jwt.go              # Utilidades de JWT
│   │   └── password.go         # Utilidades de hash
│   ├── tests/
│   │   ├── user_test.go        # Tests de usuarios
│   │   ├── product_test.go     # Tests de productos
│   │   └── order_test.go       # Tests de órdenes
│   └── main.go                 # Aplicación principal
├── java/
│   ├── pom.xml                 # Dependencias de Maven
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── crud/
│   │   │   │           ├── config/
│   │   │   │           │   └── DatabaseConfig.java
│   │   │   │           ├── models/
│   │   │   │           │   ├── User.java
│   │   │   │           │   ├── Product.java
│   │   │   │           │   └── Order.java
│   │   │   │           ├── controllers/
│   │   │   │           │   ├── UserController.java
│   │   │   │           │   ├── ProductController.java
│   │   │   │           │   └── OrderController.java
│   │   │   │           ├── repositories/
│   │   │   │           │   ├── UserRepository.java
│   │   │   │           │   ├── ProductRepository.java
│   │   │   │           │   └── OrderRepository.java
│   │   │   │           ├── services/
│   │   │   │           │   ├── UserService.java
│   │   │   │           │   ├── ProductService.java
│   │   │   │           │   └── OrderService.java
│   │   │   │           ├── utils/
│   │   │   │           │   ├── JwtUtils.java
│   │   │   │           │   └── PasswordUtils.java
│   │   │   │           └── CrudApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── crud/
│   │                   ├── UserControllerTest.java
│   │                   ├── ProductControllerTest.java
│   │                   └── OrderControllerTest.java
├── aggregation/
│   ├── user_aggregations.js    # Agregaciones de usuarios
│   ├── product_aggregations.js # Agregaciones de productos
│   └── order_aggregations.js   # Agregaciones de órdenes
├── security/
│   ├── users.js                # Creación de usuarios
│   └── permissions.js          # Configuración de permisos
├── backup/
│   ├── backup.js               # Script de respaldo
│   └── restore.js              # Script de restauración
└── examples/
    ├── basic_crud.js           # Ejemplos básicos de CRUD
    ├── advanced_queries.js     # Consultas avanzadas
    └── performance_tests.js    # Tests de rendimiento
```

## 🗄️ Esquema de la base de datos

### Colección de Usuarios
```javascript
// users collection
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  firstName: String,
  lastName: String,
  phone: String,
  dateOfBirth: Date,
  isActive: Boolean,
  isVerified: Boolean,
  role: String, // 'user', 'admin', 'moderator'
  profile: {
    avatar: String,
    bio: String,
    location: String,
    website: String
  },
  preferences: {
    language: String,
    timezone: String,
    notifications: {
      email: Boolean,
      push: Boolean,
      sms: Boolean
    }
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Colección de Productos
```javascript
// products collection
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  costPrice: Number,
  stockQuantity: Number,
  minStockLevel: Number,
  categoryId: ObjectId,
  sku: String,
  barcode: String,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String
  },
  images: [String],
  tags: [String],
  specifications: Object,
  isActive: Boolean,
  isFeatured: Boolean,
  ratings: {
    average: Number,
    count: Number,
    reviews: [{
      userId: ObjectId,
      rating: Number,
      comment: String,
      createdAt: Date
    }]
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### Colección de Categorías
```javascript
// categories collection
{
  _id: ObjectId,
  name: String,
  description: String,
  parentId: ObjectId,
  slug: String,
  image: String,
  isActive: Boolean,
  metadata: {
    seoTitle: String,
    seoDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Colección de Órdenes
```javascript
// orders collection
{
  _id: ObjectId,
  orderNumber: String,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number,
    product: {
      name: String,
      sku: String,
      image: String
    }
  }],
  totals: {
    subtotal: Number,
    taxAmount: Number,
    shippingAmount: Number,
    discountAmount: Number,
    totalAmount: Number
  },
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  paymentStatus: String, // 'pending', 'paid', 'failed', 'refunded'
  shipping: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    method: String,
    trackingNumber: String,
    estimatedDelivery: Date
  },
  billing: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    method: String,
    transactionId: String
  },
  notes: String,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

## 🔧 Operaciones CRUD

### Crear documento
```javascript
// Node.js con Mongoose
const user = new User({
  username: 'johndoe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
  firstName: 'John',
  lastName: 'Doe'
});

await user.save();

// Python con PyMongo
user = {
  'username': 'johndoe',
  'email': 'john@example.com',
  'passwordHash': 'hashed_password',
  'firstName': 'John',
  'lastName': 'Doe',
  'createdAt': datetime.utcnow()
}

result = db.users.insert_one(user)

// Go con mongo-driver
user := User{
  Username:     "johndoe",
  Email:        "john@example.com",
  PasswordHash: "hashed_password",
  FirstName:    "John",
  LastName:     "Doe",
  CreatedAt:    time.Now(),
}

result, err := collection.InsertOne(ctx, user)
```

### Leer documentos
```javascript
// Obtener todos los usuarios con paginación
const users = await User.find({ deletedAt: null })
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ createdAt: -1 });

// Obtener usuario por ID
const user = await User.findById(userId);

// Búsqueda con filtros
const users = await User.find({
  $and: [
    { deletedAt: null },
    { isActive: true },
    {
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
  ]
});
```

### Actualizar documento
```javascript
// Actualizar usuario
const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    $set: {
      firstName: 'John Updated',
      email: 'john.updated@example.com',
      updatedAt: new Date()
    }
  },
  { new: true, runValidators: true }
);

// Actualización condicional
const result = await User.updateMany(
  { isActive: false },
  { $set: { isActive: true, updatedAt: new Date() } }
);
```

### Eliminar documento
```javascript
// Soft delete
const result = await User.findByIdAndUpdate(
  userId,
  { $set: { deletedAt: new Date() } }
);

// Eliminación permanente
const result = await User.findByIdAndDelete(userId);

// Eliminación múltiple
const result = await User.deleteMany({ isActive: false });
```

## 🔄 Agregaciones

### Estadísticas de usuarios
```javascript
const userStats = await User.aggregate([
  {
    $match: { deletedAt: null }
  },
  {
    $group: {
      _id: null,
      totalUsers: { $sum: 1 },
      activeUsers: {
        $sum: { $cond: ['$isActive', 1, 0] }
      },
      verifiedUsers: {
        $sum: { $cond: ['$isVerified', 1, 0] }
      },
      adminUsers: {
        $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
      }
    }
  }
]);
```

### Productos más vendidos
```javascript
const topProducts = await Order.aggregate([
  {
    $match: { status: 'delivered' }
  },
  {
    $unwind: '$items'
  },
  {
    $group: {
      _id: '$items.productId',
      totalSold: { $sum: '$items.quantity' },
      totalRevenue: { $sum: '$items.totalPrice' },
      productName: { $first: '$items.product.name' }
    }
  },
  {
    $sort: { totalSold: -1 }
  },
  {
    $limit: 10
  }
]);
```

### Ventas por mes
```javascript
const monthlySales = await Order.aggregate([
  {
    $match: { status: 'delivered' }
  },
  {
    $group: {
      _id: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      },
      orderCount: { $sum: 1 },
      totalRevenue: { $sum: '$totals.totalAmount' },
      avgOrderValue: { $avg: '$totals.totalAmount' }
    }
  },
  {
    $sort: { '_id.year': -1, '_id.month': -1 }
  }
]);
```

## 🔒 Seguridad

### Crear usuario de aplicación
```javascript
db.createUser({
  user: "app_user",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "crud_example" }
  ]
});
```

### Configurar autenticación
```javascript
// mongod.conf
security:
  authorization: enabled

# Conectar con autenticación
mongodb://app_user:secure_password@localhost:27017/crud_example
```

## 📊 Índices

### Índices básicos
```javascript
// Índice único en email
db.users.createIndex({ "email": 1 }, { unique: true });

// Índice compuesto
db.users.createIndex({ "isActive": 1, "role": 1 });

// Índice de texto
db.users.createIndex({
  "username": "text",
  "firstName": "text",
  "lastName": "text"
});
```

### Índices para optimización
```javascript
// Índice para búsquedas por fecha
db.orders.createIndex({ "createdAt": -1 });

// Índice para búsquedas por estado
db.orders.createIndex({ "status": 1, "createdAt": -1 });

// Índice para agregaciones
db.orders.createIndex({ "userId": 1, "status": 1 });
```

## 💾 Backup y Restauración

### Script de respaldo
```javascript
// backup.js
const { exec } = require('child_process');

const backupDatabase = () => {
  const date = new Date().toISOString().split('T')[0];
  const command = `mongodump --db crud_example --out ./backups/${date}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error en backup:', error);
      return;
    }
    console.log('Backup completado:', stdout);
  });
};

backupDatabase();
```

### Script de restauración
```javascript
// restore.js
const { exec } = require('child_process');

const restoreDatabase = (backupPath) => {
  const command = `mongorestore --db crud_example ${backupPath}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error en restauración:', error);
      return;
    }
    console.log('Restauración completada:', stdout);
  });
};

restoreDatabase('./backups/2024-01-01/crud_example');
```

## 🧪 Tests

### Tests con Jest (Node.js)
```javascript
// user.test.js
describe('User CRUD Operations', () => {
  test('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      firstName: 'Test',
      lastName: 'User'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
  });

  test('should find user by email', async () => {
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });
});
```

### Tests con PyTest (Python)
```python
# test_users.py
import pytest
from pymongo import MongoClient
from models.user import User

class TestUserCRUD:
    @pytest.fixture
    def db(self):
        client = MongoClient('mongodb://localhost:27017/')
        db = client.crud_example_test
        yield db
        client.drop_database('crud_example_test')

    def test_create_user(self, db):
        user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'passwordHash': 'hashed_password',
            'firstName': 'Test',
            'lastName': 'User'
        }
        
        result = db.users.insert_one(user_data)
        assert result.inserted_id is not None
        
        user = db.users.find_one({'_id': result.inserted_id})
        assert user['username'] == user_data['username']
```

## 📈 Optimización

### Configuración de MongoDB
```yaml
# mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

operationProfiling:
  slowOpThresholdMs: 100
  mode: slowOp

replication:
  oplogSizeMB: 1024
```

### Monitoreo de rendimiento
```javascript
// Verificar consultas lentas
db.getProfilingStatus()
db.setProfilingLevel(2, 100)

// Ver estadísticas de colección
db.users.stats()

// Ver uso de índices
db.users.aggregate([
  { $indexStats: {} }
])
```

## 🚀 Despliegue

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: crud_example
    volumes:
      - mongodb_data:/data/db
      - ./init.js:/docker-entrypoint-initdb.d/init.js:ro

  mongo-express:
    image: mongo-express
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: password
      ME_CONFIG_MONGODB_URL: mongodb://admin:password@mongodb:27017/
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

### Kubernetes
```yaml
# mongodb-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
      - name: mongodb
        image: mongo:6.0
        ports:
        - containerPort: 27017
        env:
        - name: MONGO_INITDB_ROOT_USERNAME
          value: "admin"
        - name: MONGO_INITDB_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: password
        volumeMounts:
        - name: mongodb-data
          mountPath: /data/db
      volumes:
      - name: mongodb-data
        persistentVolumeClaim:
          claimName: mongodb-pvc
```

## 📚 Recursos adicionales

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Aggregation](https://docs.mongodb.com/manual/aggregation/)
- [MongoDB Performance](https://docs.mongodb.com/manual/core/performance/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. 