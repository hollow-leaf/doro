### O1JS not compatible with react native
I think this might have some way to solve it, but we cannot pass this issue.

### Frontend sign message
Because we build a mobile app, our app base on react native (doro-mobile). But o1js cannot install in RN.
RN have secure-store and we can store the private key safety and have good experience in interact with our app.

### Try Log...

[react-native-react-bridge](https://github.com/inokawa/react-native-react-bridge): compile error, in o1js-binding part

https://github.com/hollow-leaf/doro-mobile/commit/0708c4706ada61f3e0ae46e13b320d2c0e8ac22d
It might cause by expo, I think the bridge might work ok.

[mina-signer]: react-native not support nodeJS crypto (not support node packages)

also a sad story, in github we cannot find a good SDK like walletconnect for mina. 

### Future Try
- Wasm bridge: direct connect with wasm
- All assets migrate to PWA template