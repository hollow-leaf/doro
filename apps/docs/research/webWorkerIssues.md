### Web Worker Parameters Transit Issues

During the integration of Next.js, encountered web worker issues possibly related to the use of App router. 

Additionally, passing specific parameters to Mina.Transaction based on contract functions caused errors, which require further clarification on the root cause. 

This investigation involves reviewing the interaction between Next.js, the web workers, and the App router, as well as examining how Mina.Transaction handles parameter inputs from contract functions to identify and resolve the underlying issues.

Issues May Related: https://nextjs.org/docs/pages/building-your-application/optimizing/scripts#offloading-scripts-to-a-web-worker-experimental

| Warning: The worker strategy is not yet stable and does not yet work with the app directory. Use with caution.

### Try Logs
```bash
# mina transaction error
Error: Cannot parse invalid permission. [object Object] does not exist.
```