/* IMPORT */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var byte_converter_1 = require("byte-converter");
var string_matches_1 = require("string-matches");
var string_replace_all_1 = require("string-replace-all");
/* WEBPACK SUMMARY */
var SummaryPlugin = (function () {
    /* CONSTRUCTOR */
    function SummaryPlugin(options) {
        this.watching = false;
        this.options = _.extend({
            normal: '[{entry.name}] Bundled into "{entry.asset}" ({entry.size.MB}MB) in {time.s}s',
            watching: 'Bundle rebuilt in {time.s}s.'
        }, options);
    }
    /* WEBPACK */
    SummaryPlugin.prototype.apply = function (compiler) {
        compiler.plugin('compilation', this.onStart.bind(this));
        compiler.plugin('emit', this.onEnd.bind(this));
        compiler.plugin('watch-run', this.onWatch.bind(this));
    };
    SummaryPlugin.prototype.onStart = function () {
        this.startAt = Date.now();
    };
    SummaryPlugin.prototype.onEnd = function (compilation, next) {
        this.endAt = Date.now();
        var stats = compilation.getStats().toJson(), tokens = this.getTokens(stats);
        this.printTemplates(tokens);
        next();
    };
    SummaryPlugin.prototype.onWatch = function (compilation, next) {
        this.watching = true;
        next();
    };
    /* TOKENS */
    SummaryPlugin.prototype.getTimeTokens = function (milliseconds) {
        return {
            ms: milliseconds,
            s: _.round(milliseconds / 1000, 2),
            m: _.round(milliseconds / 1000 / 60, 2)
        };
    };
    SummaryPlugin.prototype.getSizeTokens = function (bytes) {
        return {
            B: bytes,
            KB: _.round(byte_converter_1.converterBase2(bytes, 'B', 'KB'), 2),
            MB: _.round(byte_converter_1.converterBase2(bytes, 'B', 'MB'), 2)
        };
    };
    SummaryPlugin.prototype.getEntriesTokens = function (stats) {
        var _this = this;
        var names = Object.keys(stats.entrypoints), assets = names.map(function (name) { return stats.assetsByChunkName[name]; }), sizes = assets.map(function (asset) {
            var assets = _.castArray(asset), objs = stats.assets.filter(function (obj) { return assets.includes(obj.name); }), sizes = _.map(objs, 'size');
            return _.sum(sizes);
        });
        return names.map(function (name, index) { return ({
            name: name,
            asset: assets[index],
            size: _this.getSizeTokens(sizes[index])
        }); });
    };
    SummaryPlugin.prototype.getTokens = function (stats) {
        return {
            stats: stats,
            size: this.getSizeTokens(_.sum(_.map(stats.assets, 'size'))),
            time: this.getTimeTokens(this.endAt - this.startAt),
            entries: this.getEntriesTokens(stats)
        };
    };
    /* TEMPLATE */
    SummaryPlugin.prototype.getTemplate = function () {
        return this.options[this.watching ? 'watching' : 'normal'];
    };
    SummaryPlugin.prototype.printTemplates = function (tokens) {
        var template = this.getTemplate();
        if (!template)
            return;
        var hasEntryToken = template.includes('{entry.');
        if (!hasEntryToken)
            return this.printTemplate(tokens);
        for (var _i = 0, _a = tokens.entries; _i < _a.length; _i++) {
            var entry = _a[_i];
            var entryTokens = _.extend({}, tokens, { entry: entry });
            this.printTemplate(entryTokens);
        }
    };
    SummaryPlugin.prototype.printTemplate = function (tokens) {
        var summary = this.getTemplate();
        if (!summary)
            return;
        var placeholders = string_matches_1.default(summary, /{[a-zA-Z0-9\._]+}/g).map(_.first);
        for (var _i = 0, placeholders_1 = placeholders; _i < placeholders_1.length; _i++) {
            var placeholder = placeholders_1[_i];
            var accessor = placeholder.slice(1, -1), value = _.get(tokens, accessor);
            summary = string_replace_all_1.default(summary, placeholder, _.isArray(value) ? value.join(', ') : String(value));
        }
        console.log(summary);
    };
    return SummaryPlugin;
}());
/* EXPORT */
exports.default = SummaryPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWTs7O0FBRVosMEJBQTRCO0FBQzVCLGlEQUErRDtBQUMvRCxpREFBeUM7QUFDekMseURBQTRDO0FBRzVDLHFCQUFxQjtBQUVyQjtJQVNFLGlCQUFpQjtJQUVqQix1QkFBYyxPQUEwQjtRQU54QyxhQUFRLEdBQVksS0FBSyxDQUFDO1FBUXhCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBRTtZQUN2QixNQUFNLEVBQUUsOEVBQThFO1lBQ3RGLFFBQVEsRUFBRSw4QkFBOEI7U0FDekMsRUFBRSxPQUFPLENBQUUsQ0FBQztJQUVmLENBQUM7SUFFRCxhQUFhO0lBRWIsNkJBQUssR0FBTCxVQUFRLFFBQVE7UUFFZCxRQUFRLENBQUMsTUFBTSxDQUFHLGFBQWEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBRyxJQUFJLENBQUUsQ0FBRSxDQUFDO1FBQzlELFFBQVEsQ0FBQyxNQUFNLENBQUcsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFHLElBQUksQ0FBRSxDQUFFLENBQUM7UUFDckQsUUFBUSxDQUFDLE1BQU0sQ0FBRyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUcsSUFBSSxDQUFFLENBQUUsQ0FBQztJQUU5RCxDQUFDO0lBRUQsK0JBQU8sR0FBUDtRQUVFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRyxDQUFDO0lBRTdCLENBQUM7SUFFRCw2QkFBSyxHQUFMLFVBQVEsV0FBVyxFQUFFLElBQWM7UUFFakMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7UUFFekIsSUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRyxDQUFDLE1BQU0sRUFBRyxFQUN6QyxNQUFN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