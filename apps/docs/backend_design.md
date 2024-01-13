### Backend Design 

not final version, the high performance to interact with mina is through serverless process (we plan to use cloudflare worker)
```mermaid
sequenceDiagram
    actor User
    participant workerd
    participant O1JS
    participant Mina
    User ->> workerd: private key
    workerd ->> O1JS: call o1js contract
    O1JS ->> Mina: get or store data (encrypt / decrypt)
  
```