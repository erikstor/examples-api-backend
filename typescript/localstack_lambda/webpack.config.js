const path = require('path');

module.exports = {
  entry: './src/presentation/handler.ts',
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  externals: {
    // Excluir AWS SDK ya que está disponible en el entorno Lambda
    // Sin embargo, para LocalStack necesitamos incluirlo
    // '@aws-sdk/client-dynamodb': 'commonjs @aws-sdk/client-dynamodb',
    // '@aws-sdk/lib-dynamodb': 'commonjs @aws-sdk/lib-dynamodb',
  },
  optimization: {
    minimize: true,
  },
  devtool: 'source-map', // Importante para debugging
};

