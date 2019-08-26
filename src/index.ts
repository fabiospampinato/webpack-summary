
/* IMPORT */

import * as _ from 'lodash';
import {converterBase2 as byteConverter} from 'byte-converter';
import findMatches from 'string-matches';
import replaceAll from 'string-replace-all';
import {Options} from './types';

/* WEBPACK SUMMARY */

class SummaryPlugin {

  /* VARIABLES */

  options: Options;
  watching: boolean = false;
  stats: any;
  startAt: number;
  endAt: number;

  /* CONSTRUCTOR */

  constructor ( options?: Partial<Options> ) {

    this.options = _.merge ({
      normal: {
        entry: '{entry.name} - {entry.size.KB}KB - {time.s}s',
        chunk: '• {chunk.name} - {chunk.size.KB}KB'
      },
      watching: {
        entry: '{entry.name} - {time.s}s',
        chunk: false
      }
    }, options );

  }

  /* WEBPACK */

  apply ( compiler ) {

    compiler.hooks.compilation.tap ( 'SummaryPlugin', this.onStart.bind ( this ) );
    compiler.hooks.emit.tap ( 'SummaryPlugin', this.onCompilation.bind ( this ) );
    compiler.hooks.done.tap ( 'SummaryPlugin', this.onEnd.bind ( this ) );
    compiler.hooks.watchRun.tap ( 'SummaryPlugin', this.onWatch.bind ( this ) );

  }

  onStart () {

    this.startAt = Date.now ();

  }

  onCompilation ( compilation ) {

    this.endAt = Date.now ();

    this.stats = compilation.getStats ().toJson ();

  }

  onEnd () {

    const tokens = this.getTokens ( this.stats );

    this.printTemplates ( tokens );

  }

  onWatch () {

    this.watching = true;

  }

  /* TOKENS */

  getTimeTokens ( milliseconds: number ) {

    return {
      ms: milliseconds,
      s: _.round ( milliseconds / 1000, 2 ),
      m: _.round ( milliseconds / 1000 / 60, 2 )
    };

  }

  getSizeTokens ( bytes: number ) {

    return {
      B: bytes,
      KB: _.round ( byteConverter ( bytes, 'B', 'KB' ), 2 ),
      MB: _.round ( byteConverter ( bytes, 'B', 'MB' ), 2 )
    };

  }

  getEntriesTokens ( stats ) {

    const names  = Object.keys ( stats.entrypoints ).sort (),
          assets = names.map ( name => stats.assetsByChunkName[name] ),
          sizes  = assets.map ( asset => {
            const assets = _.castArray ( asset ),
                  objs = stats.assets.filter ( obj => assets.includes ( obj.name ) ),
                  sizes = _.map ( objs, 'size' );
            return _.sum ( sizes );
          });

    return names.map ( ( name, index ) => ({
      name,
      size: this.getSizeTokens ( sizes[index] )
    }));

  }

  getChunksTokens ( stats ) {

    const names = stats.chunks.map ( chunk => chunk.files[0] ).sort (),
          sizes = names.map ( name => {
            const objs = stats.assets.filter ( obj => obj.name === name ),
                  sizes = _.map ( objs, 'size' );
            return _.sum ( sizes );
          });

    return names.map ( ( name, index ) => ({
      name,
      size: this.getSizeTokens ( sizes[index] )
    }));

  }

  getTokens ( stats ) {

    return {
      stats,
      size: this.getSizeTokens ( _.sum ( _.map ( stats.assets, 'size' ) ) ),
      time: this.getTimeTokens ( this.endAt - this.startAt ),
      entries: this.getEntriesTokens ( stats ),
      chunks: this.getChunksTokens ( stats )
    };

  }

  /* TEMPLATE */

  getTemplate ( key ) {

    return this.options[ this.watching ? 'watching' : 'normal' ][key];

  }

  printTemplates ( tokens ) {

    const templateEntry = this.getTemplate ( 'entry' );

    if ( templateEntry ) {

      for ( let entry of tokens.entries ) {

        const tokensEntry = _.extend ( {}, tokens, {entry} );

        this.printTemplate ( templateEntry, tokensEntry );

      }

    }

    const templateChunk = this.getTemplate ( 'chunk' );

    if ( templateChunk ) {

      for ( let chunk of tokens.chunks ) {

        const tokensChunk = _.extend ( {}, tokens, {chunk} );

        this.printTemplate ( templateChunk, tokensChunk );

      }

    }

  }

  printTemplate ( template, tokens ) {

    const placeholders = findMatches ( template, /{[a-zA-Z0-9\._]+}/g ).map ( _.first ) as string[];

    for ( let placeholder of placeholders ) {

      const accessor = placeholder.slice ( 1, -1 ),
            value = _.get ( tokens, accessor );

      template = replaceAll ( template, placeholder, _.isArray ( value ) ? value.join ( ', ' ) : String ( value ) );

    }

    console.log ( template );

  }

}

/* EXPORT */

export default SummaryPlugin;
