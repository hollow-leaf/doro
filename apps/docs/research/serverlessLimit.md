### O1JS not compatible with cloudflare worker

O1JS not compatible with Cloudflare Workers Inherent Limitations

We install the o1js in cloudflare worker but meet a problem!
```
Uncaught ReferenceError: FinalizationRegistry is not defined
```
this bug is trigger from o1js-binding (the wasm part), it's weird and hard to solve it!
The issue related in  here: https://github.com/cloudflare/workers-sdk/issues/2258
Miniflared Not support this GC behavior, so we might give up build o1js contract in cloudflare worker, we will try in aws lambda next time.

### Try logs...

Despite efforts to bridge compatibility gaps, it's crucial to acknowledge that achieving seamless integration between O1JS and Cloudflare Workers using Babel may encounter inherent limitations. The intricacies of the V8 engine in the Workers environment pose challenges that transcend the capabilities of transpilation tools like Babel. 

Rebuild o1js: (use esbuild only build need part): o1js and o1js-binding cannot split (T^T)

Babel traverse inject custom func in lib: cannot run wasm at the end, also have another error 

Patch and serverless template in ./apps/template and I will push the patch.js these few days.

### Plan Next
Use mina-signer replace o1js, backend only do middleware and verify sign.