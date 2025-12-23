# Configuração de Segurança

## TRUST_PROXY

Controla como a API identifica o IP real dos clientes.

### Desenvolvimento (TRUST_PROXY=false)

```env
TRUST_PROXY=false
```

- Usa apenas o IP direto da conexão TCP (`request.ip`)
- Ignora headers `x-forwarded-for` e `x-real-ip`
- Previne bypass de rate limiting através de headers forjados
- **Recomendado quando não há proxy reverso**

### Produção com Proxy Reverso (TRUST_PROXY=true)

```env
TRUST_PROXY=true
```

- Confia nos headers enviados pelo proxy (nginx, cloudflare, etc)
- Usa `x-forwarded-for` ou `x-real-ip` para identificar o cliente original
- **Use apenas quando a API estiver atrás de proxy reverso confiável**

### Exemplo de Configuração Nginx

```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Rate Limiting

O rate limiting é aplicado por IP do cliente:

- **Desenvolvimento**: Usa IP direto da conexão
- **Produção com proxy**: Usa IP do header se TRUST_PROXY=true
- **Whitelist**: IPs em `WHITELIST_IPS` não sofrem rate limiting

## Ataques Mitigados

✅ **Header Forgery**: Atacantes não podem forjar `x-forwarded-for` se TRUST_PROXY=false  
✅ **Rate Limit Bypass**: IP é sempre obtido de forma segura  
✅ **DDoS Básico**: Rate limiting por IP com bloqueios progressivos
