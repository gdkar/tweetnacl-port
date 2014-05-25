
#define FOR(i,n) for (i = 0;i < n;++i)
#define sv static void

static const u8 _0[16], _9[32] = {9};

var gf gf0, gf1 = [1], _121665 = [0xDB41, 1], 
    D =   [0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab,0x4141, 0x0a4d, 0x0070, 
          0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203], 
    D2 =  [0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0,
          0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406], 
    X =   [0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 
          0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169], 
    Y =   [0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 
          0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666,0x6666, 0x6666], 
    I =   [0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 
            0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83],
    L32 = function (x, c){
      return (x << c) | (x >> (32 - c));
    } ,
    ld32 = function ( x, n  )
    {
      var u = x[n+3];
      u = (u << 8) | x[n+2];
      u = (u << 8) | x[n+1];
      return (u << 8) | x[n+0];
    },
    dl64 = function ( x, n ){
    var i = 0, u = 0, v=0;
    for ( ; i<8; i++){
      u = ( u << 8 ) | x[n+i  ];
      v = ( v << 8 ) | x[n+4+i];
    }
    return [u,v];
    } ,
    st32 = function ( x, n, u ){
      var i = 0; 
      for ( ; i < 4; i++ ){
        x[n+i] = u&255;
        u >>= 8;
      } return x;
    }, 
    ts64 = function ( x, n, u ){
      var i = 0;
      for (i = 7; i >= 0; --i) {
        x[n+i] = u&255;
        u >>= 8;
      }
    },
    vn( x, y, n)
    {
      var i = 0, d = 0;
      for(i;i<n;+=i) d |= x[i] ^ y[i];
      return (1 & ((d - 1) >> 8)) - 1;
    },
    crypto_verify_16( x, y ){
      return vn(x, y, 16);
    },
    crypto_verify_32( x, y ){
      return vn(x, y, 32);
    },
    a16 = function () { 
      return [0.0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0];
    },
    a17 = function () { 
      return [0.0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0
              0               ];
    },

    a32 = function () { 
      return [0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,];

    },
    a64 = function () { 
      return [0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,];

    },
    a96 = function () { 
      return [0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,
              0.0,0,0,0,0,0,0,0.0,0,0,0,0,0,0,];

    },

    core( out, in_,  k,  c,  h)
    {
      var w = a16(),  x = a16(),  y = a16(), t = [0,0,0,0],
          i = 0,      j = 0,      m = 0;
      for (;i<4;i++){
          x[5  * i] = ld32(c, 4 * i);
          x[1  + i] = ld32(k, 4 * i);
          x[6  + i] = ld32(in_, 4 * i);
          x[11 + i] = ld32(k, 16 + 4 * i);
      }
      for (i=0;i<16;i++){ y[i] = x[i];}
      for (i=0;i<20;i++){
          for (j=0;j<4;j++){
              for (m=0;m<4;m++){t[m] = x[(5 * j + 4 * m) % 16];}
              t[1] ^= L32(t[0] + t[3], 7);
              t[2] ^= L32(t[1] + t[0], 9);
              t[3] ^= L32(t[2] + t[1], 13);
              t[0] ^= L32(t[3] + t[2], 18);
              for (m=0;m<4;m++){ w[4 * j + (j + m) % 4] = t[m];}
          }
          for(m=0;m<16;++){ x[m] = w[m];}
      }
      if (h) {
          for (i=0;i<16;i++){ x[i] += y[i];}
          for (i=0;i<4 ;i++){
              x[5 * i] -= ld32(c,   4 * i);
              x[6 + i] -= ld32(in_, 4 * i);
          }
          for (i=0;i<4 ;i++){
              st32(out,   4 * i,      x[5 * i]);
              st32(out,   16 + 4 * i, x[6 + i]);
          }
      } else {
          for (i=0;i<16;i++){ st32(out, 4 * i, x[i] + y[i]);}
      }
  },crypto_core_salsa20( out, in_, k, c){
    core(out, in_, k, c, 0);
    return 0;
  },
  crypto_core_hsalsa20( out,  in_, k,  c)
  {
    core(out, in, k, c, 1);
    return 0;
  } ,
  sigma[16] = [101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107], //"expand 32-byte k";
  crypto_stream_salsa20_xor( c, m, b, n, k)
  {
    var z = a16(), x = a64(), u = 0, i = 0;
    if (!b) {
        return 0;
    }
    for ( i=0;i<16;i++){
        z[i] = 0;
    }
    for (i=0;i<8;i++){
        z[i] = n[i];
    }
    while (b >= 64) {
        crypto_core_salsa20(x, z, k, sigma);
        for(i=0;i<64;i++){
            c[i] = (m ? m[i] : 0) ^ x[i];
        }
        u = 1;
        for (i = 8; i < 16; ++i) {
            u +=  z[i]|0;
            z[i] = u;
            u >>= 8;
        }
        b -= 64;
        c += 64;
        if (m) {
            m += 64;
        }
    }
    if (b) {
        crypto_core_salsa20(x, z, k, sigma);
        for(i=0;i<b;i++){
            c[i] = (m ? m[i] : 0) ^ x[i];
        }
    }
    return 0;
  },
  crypto_stream_salsa20(  c, d,  n, k)
  {
    return crypto_stream_salsa20_xor(c, 0, d, n, k);
  }, 
  crypto_stream( c, d, n, k){
    var s  = a32();
    crypto_core_hsalsa20(s, n, k, sigma);
    return crypto_stream_salsa20(c, d, n + 16, s);
  },
  crypto_stream_xor( c, m, d, n, k) {
    var s = a32();
    crypto_core_hsalsa20(s, n, k, sigma);
    return crypto_stream_salsa20_xor(c, m, d, n + 16, s);
  },
  add1305( h, c)  {
    var j = 0, u = 0;
    for ( j=0;j<17;j++){
        u += h[j] + c[j];
        h[j] = u & 255;
        u >>= 8;
    }
  },
  minusp = [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 252],
  crypto_onetimeauth( out,  m,  n, k){
    var s = 0, i = 0, j = 0, u = 0, x = a17(), r = a17(), h = a17(), c = a17(), g=a17();
    for(j=0;j<17;j++){
        r[j] = h[j] = 0;
    }
    for(j=0;j<16;j++){
        r[j] = k[j];
    }
    r[3] &= 15;
    r[4] &= 252;
    r[7] &= 15;
    r[8] &= 252;
    r[11] &= 15;
    r[12] &= 252;
    r[15] &= 15;
    while (n > 0) {
        for(j=0;j<17;j++){
            c[j] = 0;
        }
        for (j = 0; (j < 16) && (j < n); ++j) {
            c[j] = m[j];
        }
        c[j] = 1;
        m += j;
        n -= j;
        add1305(h, c);
        for(i=0;i<17;i++){
            x[i] = 0;
            for(j=0;j<17;j++){
                x[i] += h[j] * ((j <= i) ? r[i - j] : 320 * r[i + 17 - j]);
            }
        }
        for(i=0;i<17;i++){
            h[i] = x[i];
        }
        u = 0;
        for(j=0;j<16;j++){
            u += h[j];
            h[j] = u & 255;
            u >>= 8;
        }
        u += h[16];
        h[16] = u & 3;
        u = 5 * (u >> 2);
        for(j=0;j<16;j++){
            u += h[j];
            h[j] = u & 255;
            u >>= 8;
        }
        u += h[16];
        h[16] = u;
    }
    for(j=0;j<17;j++){
        g[j] = h[j];
    }
    add1305(h, minusp);
    s = -(h[16] >> 7);
    for(j=0;j<17;j++){
        h[j] ^= s & (g[j] ^ h[j]);
    }
    for(j=0;j<16;j++){
        c[j] = k[j + 16];
    }
    c[16] = 0;
    add1305(h, c);
    for(j=0;j<16;j++){
        out[j] = h[j];
    }
    return 0;
  } , crypto_onetimeauth_verify( h, m, n, k){
    u8 x = a16();
    crypto_onetimeauth(x, m, n, k);
    return crypto_verify_16(h, x);
  },
  crypto_secretbox( c, m, d,  n,  k){
    var i = 0;;
    if (d < 32) {
        return -1;
    }
    crypto_stream_xor(c, m, d, n, k);
    crypto_onetimeauth(c + 16, c + 32, d - 32, c);
    for(i=0;i<16;i++){
        c[i] = 0;
    }
    return 0;
  } ,
  crypto_secretbox_open( m,  c, d,  n, k)
  {
    var i = 0;
    u8 x = a32();
    if (d < 32) {
        return -1;
    }
    crypto_stream(x, 32, n, k);
    if (crypto_onetimeauth_verify(c + 16, c + 32, d - 32, x) != 0) {
        return -1;
    }
    crypto_stream_xor(m, c, d, n, k);
    for(i=0;i<32;i++){
        m[i] = 0;
    }
    return 0;
  } ,
  set25519( r,  a){
    var i = 0;
    for(;i<16;i++){
        r[i] = a[i];
    }
  } ,
  car25519( o){
    var i = 0, c = 0
    for(i=0;i<16;i++){
        o[i] += (1 << 16);
        c = o[i] >> 16;
        o[(i + 1) * (i < 15)] += c - 1 + 37 * (c - 1) * (i == 15);
        o[i] -= c << 16;
    }
  } ,
  sel25519( p,  q,  b){
    var t =  0, i =  0, c = ~(b - 1);
    for(;i<16;i++){
        t = c & (p[i] ^ q[i]);
        p[i] ^= t;
        q[i] ^= t;
    }
  } ,pack25519( o,  n){
    var i = 0, j = 0, b = 0,
        m = a17(), t = a17();
    for(;i<16;i++){t[i] = n[i];}
    car25519(t);
    car25519(t);
    car25519(t);
    for(j=0;j<2){
        m[0] = t[0] - 0xffed;
        for (i = 1; i < 15; i++) {
            m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
            m[i - 1] &= 0xffff;
        }
        m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
        b = (m[15] >> 16) & 1;
        m[15] &= 0xffff;
        sel25519(t, m, 1 - b);
    }
    for(i=0;i<16;i++){
        o[2 * i] = t[i] & 0xff;
        o[2 * i + 1] = t[i] >> 8;
    }
  } ,
  neq25519( a, c b)
  {
    var c = a32(), d = a32();
    pack25519(c, a);
    pack25519(d, b);
    return crypto_verify_32(c, d);
  } ,
   par25519( a){
    d = a32()
    pack25519(d, a);
    return d[0] & 1;
  } ,
  unpack25519( o, n){
    var i = 0;
    for(;i<16;i++){
        o[i] = n[2 * i] + ((i64) n[2 * i + 1] << 8);
    }
    o[15] &= 0x7fff;
  } ,
  A( o,  a, b){
    var i = 0;
    for(;i<16;i++){
        o[i] = a[i] + b[i];
    }
  } ,
  Z( o, a,  b){
    int i = 0;
    for(;i<16;i++){
        o[i] = a[i] - b[i];
    }
  } ,
  M( o,  a,  b){
    var i = 0, j = 0, t=a32();
    for(;i<31;i++){
        t[i] = 0;
    }
    for(i=0;i<16;i++){
        for(j=0;j<16;j++){
            t[i + j] += a[i] * b[j];
        }
    }
    for(i=0;i<15;i++){
        t[i] += 38 * t[i + 16];
    }
    for(i=0;i<16;i++){
        o[i] = t[i];
    }
    car25519(o);
    car25519(o);
  } ,
  S( o, a){
    M(o, a, a);
  } ,
  inv25519( o, i ){
    var c = a17(),a = 0;
    for(a=0;a<16;a++){
        c[a] = i[a];
    }
    for (a = 253; a >= 0; a--) {
        S(c, c);
        if (a != 2 && a != 4) {
            M(c, c, i);
        }
    }
    for(a=0;a<16;a++){
        o[a] = c[a];
    }
  } ,
  pow2523( o,  i){
    var c = a17(), a=0;
    for(;a<16;a++){
        c[a] = i[a];
    }
    for (a = 250; a >= 0; a--) {
        S(c, c);
        if (a != 1) {
            M(c, c, i);
        }
    }
    for(a=0;a<16;a++){
        o[a] = c[a];
    }
  } ,
  crypto_scalarmult( q, n,  p){
    u8 z[32];
    z = a31(),
    i64 x[96], r, i;
    gf a, b, c, d, e, f;
    for(i=0;i<31;i++){
        z[i] = n[i];
    }
    z[31] = (n[31] & 127) | 64;
    z[0] &= 248;
    unpack25519(x, p);
    for (i=0;i<16;i++){
        b[i] = x[i];
        d[i] = a[i] = c[i] = 0;
    }
    a[0] = d[0] = 1;
    for (i = 254; i >= 0; --i) {
        r = (z[i >> 3] >> (i & 7)) & 1;
        sel25519(a, b, r);
        sel25519(c, d, r);
        A(e, a, c);
        Z(a, a, c);
        A(c, b, d);
        Z(b, b, d);
        S(d, e);
        S(f, a);
        M(a, c, a);
        M(c, b, e);
        A(e, a, c);
        Z(a, a, c);
        S(b, a);
        Z(c, d, f);
        M(a, c, _121665);
        A(a, a, d);
        M(c, c, a);
        M(a, d, f);
        M(d, b, x);
        S(b, e);
        sel25519(a, b, r);
        sel25519(c, d, r);
    }
    for(i=0;i<16;i++){
        x[i + 32] = a[i];
        x[i + 48] = c[i];
        x[i + 64] = b[i];
        x[i + 80] = d[i];
    }
    inv25519(x + 48, x + 48);
    M(x + 32, x + 32, x + 48);
    pack25519(q, x + 32);
    return 0;
  } ,crypto_scalarmult_base( q,  n){
      return crypto_scalarmult(q, n, _9);
  },
  crypto_box_keypair( y,  x) {
    randombytes(x, 32);
    return crypto_scalarmult_base(y, x);
  } ,
  crypto_box_beforenm( k, y, x)
  {
    s=a32();
    crypto_scalarmult(s, x, y);
    return crypto_core_hsalsa20(k, _0, s, sigma);
  } ,
  crypto_box_afternm = function( c,  m, d,  n,  k){
    return crypto_secretbox(c, m, d, n, k);
  } ,
  crypto_box_open_afternm = function( m,  c, d,  n, k)  {
    return crypto_secretbox_open(m, c, d, n, k);
  },
  crypto_box = function( c,  m, d, n,  y,  x){
    var k = a32();
    crypto_box_beforenm(k, y, x);
    return crypto_box_afternm(c, m, d, n, k);
  } ,
  crypto_box_open = function (  m,  c,  d, cn,  y,  x){
    var k = a32();
    crypto_box_beforenm(k, y, x);
    return crypto_box_open_afternm(m, c, d, n, k);
  } ,
  R = function( x, c){
    var t = (c&31) ? [ ((x[0]>>> c) | (x[1]<<32-c))>>>0,((x[1]>>>c)|(x[0]<<32-c))>>>0] : [x[0],x[1]]
    return  ((c & 32) ?[t[1],t[0]]: t);
  } ,
  s64 = function(z){
    var p = [0,0],i=0;
    for ( ;i<z.length;i++){
      p[0]+=z[i][0];
      p[1]+=z[i][1];
    }
    return p;
  }
  Ch( x,  y,  z)
  {
    return [(x[0] & y[0]) ^ (~x[0] & z[0]),
            (x[1] & y[1]) ^ (~x[1] & z[1])]
  } ,
   Maj( x,  y,  z) {
    return [(x[0] & y[0]) ^ (x[0] & z[0]) ^ (y[0] & z[0]),
            (x[1] & y[1]) ^ (x[1] & z[1]) ^ (y[1] & z[1])]

  } ,
  Sigma0( x) {
    return R(x, 28) ^ R(x, 34) ^ R(x, 39);
  } ,
  Sigma1( x) {
    return R(x, 14) ^ R(x, 18) ^ R(x, 41);
  } ,
  sigma0(x) {
    return R(x, 1) ^ R(x, 8) ^ (x >> 7);
  } ,
  sigma1( x){
    return R(x, 19) ^ R(x, 61) ^ (x >> 6);
  } ,
 primes = (function () {
  var i=0,s=[2],p=0,n=80,ret=[];
  for(;p<n;) {
    for(i=s[p]*s[p]; i< 512; s[i]=1,i+=s[p]);
    p++;s[p]=s[p-1]+1;
    for(;s[s[p]];s[p]++);};
  for(i=0;i<80;ret[i]=s[i],i++); 
  return ret;
 })(),
 _sha_iv = (function (){
   var i=0,a=0,b=0,p=0,w=0,x=[0,0,0],_init = a16();
  for(i=0;i<8;i++){
    a=primes[i],b=0,p=0.25,w=0,x=[0,0,0],n=64;
    for(;a>1;a/=4,n++);
    for(;n--;){
      w=a-2*b-p;
      a=(w>0?w:a) *2;
      b=(w>0?p:0) +b;
      x[2-(n>>5)]*=2;
      x[2-(n>>5)]+=(w>0?1:0);
      p=p/2;
    }
    _init[i*2   ] = x[1];
    _init[i*2+1 ] = x[2];
  }
  return _init;
 })(),
 _sha_key = function (){
   var i=0,n=0,a=0,b=0,c=0,p=0,w=0,x=[0,0,0],_key=[]
  for(i=0;i<80;i++){
    n=64,a=2*primes[i],b=0,c=0,p=0.25,x=[0,0,0],w=0;
    for(;a>1;a/=8,n++);
    for(;n--;){
      w = a - 3*(b+c)-p;
      a=(w>0?w:a)   *2;
      b=(w>0?2*c+p:0)+b;
      c=(w>0?c+p:c)/2;
      x[2-(n>>>5)]*=2; 
      x[2-(n>>>5)]+=(w>0?1:0); 
      p=p/4;}
      _key[i*2  ] = x[1];
      _key[i*2+1] = x[2];
      }
   return _key;
  })(),
  var a8x64   = function ( ) { return [[0,0],[0,0],[0,0],[0,0], [0,0],[0,0],[0,0],[0,0]]},
  var a16x64  = 

  crypto_hashblocks( x, m, n)
{
    var z = a16(), b=a8x64(), b=a8x64(),t=0,i=0,j=0,p=[0,0]
    for(i=0;i<8;i++){
        z[i] = a[i] = dl64(x, 8 * i);
    }
    while (n >= 128) {
        for(i=0;i<16;i++){
            w[i] = dl64(m, 8 * i);
        }
        for(i=0;i<80;i++){
            for(j=0;j<8;j++){
                b[j] = a[j];
            }
            t = a[7] + Sigma1(a[4]) + Ch(a[4], a[5], a[6]) + K[i] + w[i % 16];
            b[7] = t + Sigma0(a[0]) + Maj(a[0], a[1], a[2]);
            b[3] += t;
            FOR(j, 8) a[(j + 1) % 8] = b[j];
            if (i % 16 == 15) {
                FOR(j, 16) w[j] += w[(j + 9) % 16] + sigma0(w[(j + 1) % 16]) + sigma1(w[(j + 14) % 16]);
            }
        }
        FOR(i, 8) {
            a[i] += z[i];
            z[i] = a[i];
        }
        m += 128;
        n -= 128;
    }
    FOR(i, 8) {
        ts64(x + 8 * i, z[i]);
    }
    return n;
} 

static
const u8 iv[64] = {0x6a, 0x09, 0xe6, 0x67, 0xf3, 0xbc, 0xc9, 0x08, 0xbb, 0x67, 0xae, 0x85, 0x84, 0xca, 0xa7, 0x3b, 0x3c, 0x6e, 0xf3, 0x72, 0xfe, 0x94, 0xf8, 0x2b,
    0xa5, 0x4f, 0xf5, 0x3a, 0x5f, 0x1d, 0x36, 0xf1, 0x51, 0x0e, 0x52, 0x7f, 0xad, 0xe6, 0x82, 0xd1, 0x9b, 0x05, 0x68, 0x8c, 0x2b, 0x3e, 0x6c, 0x1f, 0x1f, 0x83, 0xd9, 0xab,
    0xfb, 0x41, 0xbd, 0x6b, 0x5b, 0xe0, 0xcd, 0x19, 0x13, 0x7e, 0x21, 0x79};

int 
crypto_hash(u8 * out, const u8 * m, u64 n)
{
    u8 h[64], x[256];
    u64 i, b = n;
    FOR(i, 64) {
        h[i] = iv[i];
    }
    crypto_hashblocks(h, m, n);
    m += n;
    n &= 127;
    m -= n;
    FOR(i, 256) {
        x[i] = 0;
    }
    FOR(i, n) {
        x[i] = m[i];
    }
    x[n] = 128;
    n = 256 - 128 * (n < 112);
    x[n - 9] = b >> 61;
    ts64(x + n - 8, b << 3);
    crypto_hashblocks(h, x, n);
    FOR(i, 64) {
        out[i] = h[i];
    }
    return 0;
} 

sv add(gf p[4], gf q[4]) {
    gf a, b, c, d, t, e, f, g, h;
    Z(a, p[1], p[0]);
    Z(t, q[1], q[0]);
    M(a, a, t);
    A(b, p[0], p[1]);
    A(t, q[0], q[1]);
    M(b, b, t);
    M(c, p[3], q[3]);
    M(c, c, D2);
    M(d, p[2], q[2]);
    A(d, d, d);
    Z(e, b, a);
    Z(f, d, c);
    A(g, d, c);
    A(h, b, a);
    M(p[0], e, f);
    M(p[1], h, g);
    M(p[2], g, f);
    M(p[3], e, h);
} 

sv cswap(gf p[4], gf q[4], u8 b) {
    int i;
    FOR(i, 4) {
        sel25519(p[i], q[i], b);
    }
} 

sv 
pack(u8 * r, gf p[4])
{
    gf tx, ty, zi;
    inv25519(zi, p[2]);
    M(tx, p[0], zi);
    M(ty, p[1], zi);
    pack25519(r, ty);
    r[31] ^= par25519(tx) << 7;
} 

sv 
scalarmult(gf p[4], gf q[4], const u8 * s)
{
    int i;
    set25519(p[0], gf0);
    set25519(p[1], gf1);
    set25519(p[2], gf1);
    set25519(p[3], gf0);
    for (i = 255; i >= 0; --i) {
        u8 b = (s[i / 8] >> (i & 7)) & 1;
        cswap(p, q, b);
        add(q, p);
        add(p, p);
        cswap(p, q, b);
    }
} 

sv
scalarbase(gf p[4], const u8 * s){
    gf q[4];
    set25519(q[0], X);
    set25519(q[1], Y);
    set25519(q[2], gf1);
    M(q[3], X, Y);
    scalarmult(p, q, s);
} 

int
crypto_sign_keypair(u8 * pk, u8 * sk) {
    u8 d[64];
    gf p[4];
    int i;
    randombytes(sk, 32);
    crypto_hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    scalarbase(p, d);
    pack(pk, p);
    FOR(i, 32) {
        sk[32 + i] = pk[i];
    }
    return 0;
} 

static const u64 L[32] = {0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6,
    0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10};

sv 
modL(u8 * r, i64 x[64])
{
    i64 carry, i, j;
    for (i = 63; i >= 32; --i) {
        carry = 0;
        for(j = i - 32; j < i - 12; ++j) {
            x[j] += carry - 16 * x[i] * L[j - (i - 32)];
            carry = (x[j] + 128) >> 8;
            x[j] -= carry << 8;
        }
        x[j] += carry;
        x[i] = 0;
    } carry = 0;
    FOR(j, 32) {
        x[j] += carry - (x[31] >> 4) * L[j];
        carry = x[j] >> 8;
        x[j] &= 255;
    }
    FOR(j, 32) {
        x[j] -= carry * L[j];
    }
    FOR(i, 32) {
        x[i + 1] += x[i] >> 8;
        r[i] = x[i] & 255;
    }
} 

sv 
reduce(u8 * r)
{
    i64 x[64], i;
    FOR(i, 64) {
        x[i] = (u64) r[i];
    }
    FOR(i, 64) {
        r[i] = 0;
    }
    modL(r, x);
} 

int 
crypto_sign(u8 * sm, u64 * smlen, const u8 * m, u64 n, const u8 * sk)
{
    u8 d[64], h[64], r[64];
    i64 i, j, x[64];
    gf p[4];
    crypto_hash(d, sk, 32);
    d[0] &= 248;
    d[31] &= 127;
    d[31] |= 64;
    *smlen = n + 64;
    FOR(i, n) {
        sm[64 + i] = m[i];
    }
    FOR(i, 32) {
        sm[32 + i] = d[32 + i];
    }
    crypto_hash(r, sm + 32, n + 32);
    reduce(r);
    scalarbase(p, r);
    pack(sm, p);
    FOR(i, 32) {
        sm[i + 32] = sk[i + 32];
    }
    crypto_hash(h, sm, n + 64);
    reduce(h);
    FOR(i, 64) {
        x[i] = 0;
    }
    FOR(i, 32) {
        x[i] = (u64) r[i];
    }
    FOR(i, 32) {
        FOR(j, 32) {
            x[i + j] += h[i] * (u64) d[j];
        }
    }
    modL(sm + 32, x);
    return 0;
} 

static int 
unpackneg(gf r[4], const u8 p[32])
{
    gf t, chk, num, den, den2, den4, den6;
    set25519(r[2], gf1);
    unpack25519(r[1], p);
    S(num, r[1]);
    M(den, num, D);
    Z(num, num, r[2]);
    A(den, r[2], den);
    S(den2, den);
    S(den4, den2);
    M(den6,
        den4, den2);
    M(t, den6, num);
    M(t, t, den);
    pow2523(t, t);
    M(t, t, num);
    M(t, t, den);
    M(t, t, den);
    M(r[0], t, den);
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) {
        M(r[0], r[0], I);
    }
    S(chk, r[0]);
    M(chk, chk, den);
    if (neq25519(chk, num)) {
        return -1;
    }
    if (par25519(r[0]) == (p[31] >> 7)) {
        Z(r[0], gf0, r[0]);
    }
    M(r[3], r[0], r[1]);
    return 0;
} 

int 
crypto_sign_open(u8 * m, u64 * mlen, const u8 * sm, u64 n, const u8 * pk)
{
    int i;
    u8 t[32], h[64];
    gf p[4], q[4];
    *mlen = -1;
    if (n < 64) {
        return -1;
    }
    if (unpackneg(q, pk)) {
        return -1;
    }
    FOR(i, n) {
        m[i] = sm[i];
    }
    FOR(i, 32) {
        m[i + 32] = pk[i];
    }
    crypto_hash(h, m, n);
    reduce(h);
    scalarmult(p, q, h);
    scalarbase(q, sm + 32);
    add(p, q);
    pack(t, p);
    n -= 64;
    if (crypto_verify_32(sm, t)) {
        FOR(i, n) {
            m[i] = 0;
        }
        return -1;
    }
    FOR(i, n) {
        m[i] = sm[i + 64];
    }
    *mlen = n;
    return 0;
}
