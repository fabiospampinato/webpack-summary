
/* IMPORT */

import * as _ from 'lodash';
import {converterBase2 as byteConverter} from 'byte-converter';
import findMatches from 'string-matches';
import replaceAll from 'string-replace-all';
import {options} from './types';

/* WEBPACK SUMMARY */

class SummaryPlugin {

  /* VARIABLES */

  options: options;
  watching: boolean = false;
  startAt: number;
  endAt: number;

  /* CONSTRUCTOR */

  constructor ( options?: Partial<options> ) {

    this.options = _.extend ({
      normal: '[{entry.name}] Bundled into "{entry.asset}" ({entry.size.MB}MB) in {time.s}s',
      watching: 'Bundle rebuilt in {time.s}s.'
    }, options );

  }

  /* WEBPACK */

  apply ( compiler ) {

    compiler.plugin ( 'compilation', this.onStart.bind ( this ) );
    compiler.plugin ( 'emit', this.onEnd.bind ( this ) );
    compiler.plugin ( 'watch-run', this.onWatch.bind ( this ) );

  }

  onStart () {

    this.startAt = Date.now ();

  }

  onEnd ( compilation, next: Function ) {

    this.endAt = Date.now ();

    const stats = compilation.getStats ().toJson (),
          tokens = this.getTokens ( stats );

    this.printTemplates ( tokens );

    next ();

  }

  onWatch (compilation, next: Function ) {

    this.watching = true;

    next ();

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

    const names  = Object.keys ( stats.entrypoints ),
          assets = names.map ( name => stats.assetsByChunkName[name] ),
          sizes  = assets.map ( asset => {
            const assets = _.castArray ( asset ),
                  objs = stats.assets.filter ( obj => assets.includes ( obj.name ) ),
                  sizes = _.map ( objs, 'size' );
            return _.sum ( sizes );
          });

    return names.map ( ( name, index ) => ({
      name,
      asset: assets[index],
      size: this.getSizeTokens ( sizes[index] )
    }));

  }

  getTokens ( stats ) {

    return {
      stats,
      size: this.getSizeTokens ( _.sum ( _.map ( stats.assets, 'size' ) ) ),
      time: this.getTimeTokens ( this.endAt - this.startAt ),
      entries: this.getEntriesTokens ( stats )
    };

  }

  /* TEMPLATE */

  getTemplate () {

    return this.options[ this.watching ? 'watching' : 'normal' ];

  }

  printTemplates ( tokens ) {

    const template = this.getTemplate ();

    if ( !template ) return;

    const hasEntryToken = template.includes ( '{entry.' );

    if ( !hasEntryToken ) return this.printTemplate ( tokens );

    for ( let entry of tokens.entries ) {

      const entryTokens = _.extend ( {}, tokens, {entry} );

      this.printTemplate ( entryTokens );

    }

  }

  printTemplate ( tokens ) {

    let summary = this.getTemplate ();

    if ( !summary ) return;

    let placeholders = findMatches ( summary, /{[a-zA-Z0-9\._]+}/g ).map ( _.first ) as string[];

    for ( let placeholder of placeholders ) {

      const accessor = placeholder.slice ( 1, -1 ),
            value = _.get ( tokens, accessor );

      summary = replaceAll ( summary, placeholder, _.isArray ( value ) ? value.join ( ', ' ) : String ( value ) );

    }

    console.log ( summary );

  }

}

/* EXPORT */

export = Object.assign ( SummaryPlugin, { default: SummaryPlugin } );
