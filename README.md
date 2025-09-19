# healthDataFrontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### 需要修改本地

```sh
spring:
  # MySQL 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/你的数据库名?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=UTC
    username: root（使用的数据库所对应的数据库服务）
    password: 
    
  # 【新增】邮件配置
  mail:
    host: smtp.qq.com
    port: 587
    username: 
    password: 
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
# 日志配置
logging:
  level:
    # 将项目mapper包下的日志级别设为DEBUG，方便在控制台看到执行的SQL语句
    com.cdut.healthdatabackend.mapper: DEBUG
```
