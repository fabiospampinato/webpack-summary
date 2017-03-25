
/* IMPORT */

import * as _ from 'lodash';
import {converterBase2 as byteConverter} from 'byte-converter';
import findMatches from 'string-matches';
import replaceAll from 'string-replace-all';

/* WEBPACK SUMMARY */

class SummaryPlugin {

  /* VARIABLES */

  template: string;
  startAt: number;
  endAt: number;

  /* CONSTRUCTOR */

  constructor ( template: string = `[{entry.name}] Bundled into "{entry.asset}" ({entry.size.MB}MB) in {time.s}s` ) {

    this.template = template;

  }

  /* WEBPACK */

  apply ( compiler ) {

    compiler.plugin ( 'compilation', this.onStart.bind ( this ) );
    compiler.plugin ( 'emit', this.onEnd.bind ( this ) );

  }

  onStart () {

    this.startAt = Date.now ();

  }

  onEnd ( compilation, next ) {

    this.endAt = Date.now ();

    const stats = compilation.getStats ().toJson (),
          tokens = this.getTokens ( stats );

    this.printTemplates ( tokens );

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
          sizes  = assets.map ( asset => stats.assets.find ( obj => obj.name === asset ).size );

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

  /* PRINT */

  printTemplates ( tokens ) {

    const hasEntryToken = this.template.includes ( '{entry.' );

    if ( !hasEntryToken ) return this.printTemplate ( tokens );

    for ( let entry of tokens.entries ) {

      const entryTokens = _.extend ( {}, tokens, {entry} );

      this.printTemplate ( entryTokens );

    }

  }

  printTemplate ( tokens ) {

    let summary = this.template,
        placeholders = findMatches ( summary, /{[a-zA-Z0-9\._]+}/g ).map ( _.first ) as string[];

    for ( let placeholder of placeholders ) {

      const accessor = placeholder.slice ( 1, -1 ),
            value = String ( _.get ( tokens, accessor ) );

      summary = replaceAll ( summary, placeholder, value );

    }

    console.log ( summary );

  }

}

/* EXPORT */

export default SummaryPlugin;
