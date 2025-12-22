# 📱 Configuração do WhatsApp - whapi.cloud

## 🚀 Passo a Passo Rápido

### 1. Criar Conta no whapi.cloud
1. Acesse: https://whapi.cloud
2. Clique em "Sign Up" (Cadastrar)
3. Preencha seus dados e confirme o email

### 2. Conectar seu WhatsApp
1. Faça login no painel do whapi.cloud
2. Clique em "Create Channel" (Criar Canal)
3. Escolha "WhatsApp Business API"
4. Escaneie o QR Code com seu WhatsApp
5. Aguarde a conexão ser estabelecida

### 3. Obter o Token de API
1. No painel, vá em "API Settings" (Configurações da API)
2. Copie o **Token** exibido
3. Exemplo de token:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
   ```

### 4. Configurar no EduFocus
1. Abra o arquivo: `facial-recognition\.env`
2. Cole seu token na linha:
   ```env
   WHAPI_TOKEN=cole_seu_token_aqui
   ```
3. Salve o arquivo

### 5. Testar Envio
1. Inicie o serviço Python:
   ```bash
   cd facial-recognition
   venv\Scripts\activate
   python app.py
   ```
2. Cadastre um aluno com foto e telefone do responsável
3. Abra a câmera de entrada
4. Quando o aluno for reconhecido, o WhatsApp será enviado!

## 📋 Formato do Telefone

O telefone do responsável deve estar no formato:
```
5511999999999
```

Onde:
- `55` = Código do Brasil
- `11` = DDD
- `999999999` = Número do celular (9 dígitos)

**Exemplo completo:**
- São Paulo: `5511987654321`
- Rio de Janeiro: `5521987654321`
- Brasília: `5561987654321`

## 📱 Mensagem Enviada

Quando um aluno for reconhecido, o responsável receberá:

```
🎓 *EduFocus - Notificação de Entrada*

✅ O aluno *João Silva* chegou à escola!

🏫 Escola: Escola Municipal ABC
🕐 Horário: 04/12/2024 07:30:15

_Mensagem automática do sistema EduFocus_
```

## 🔧 Solução de Problemas

### Erro: "WhatsApp não configurado"
- Verifique se o `WHAPI_TOKEN` está no arquivo `.env`
- Certifique-se de que não há espaços antes ou depois do token

### Erro: "Failed to send WhatsApp"
- Verifique se sua conta whapi.cloud está ativa
- Confirme que o número do WhatsApp está conectado
- Teste o envio manual no painel do whapi.cloud

### Telefone não recebe
- Confirme o formato: `5511999999999`
- Verifique se o número está salvo corretamente no cadastro do aluno
- Teste com seu próprio número primeiro

## 💰 Planos do whapi.cloud

### Plano Gratuito (Free)
- ✅ 1.000 mensagens/mês
- ✅ 1 canal WhatsApp
- ✅ Perfeito para testar

### Plano Pago (a partir de $29/mês)
- ✅ 10.000+ mensagens/mês
- ✅ Múltiplos canais
- ✅ Suporte prioritário

## 📞 Suporte whapi.cloud

- Email: support@whapi.cloud
- Documentação: https://whapi.cloud/docs
- Discord: https://discord.gg/whapi

## ✅ Checklist de Configuração

- [ ] Conta criada no whapi.cloud
- [ ] WhatsApp conectado
- [ ] Token copiado
- [ ] Token colado no arquivo `.env`
- [ ] Serviço Python reiniciado
- [ ] Telefone do responsável no formato correto
- [ ] Teste realizado com sucesso

---

**Pronto! Agora o sistema enviará WhatsApp automaticamente quando um aluno for reconhecido! 🎉**
