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
    function SummaryPlugin(template) {
        if (template === void 0) { template = "[{entry.name}] Bundled into \"{entry.asset}\" ({entry.size.MB}MB) in {time.s}s"; }
        this.template = template;
    }
    /* WEBPACK */
    SummaryPlugin.prototype.apply = function (compiler) {
        compiler.plugin('compilation', this.onStart.bind(this));
        compiler.plugin('emit', this.onEnd.bind(this));
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
        var names = Object.keys(stats.entrypoints), assets = names.map(function (name) { return stats.assetsByChunkName[name]; }), sizes = assets.map(function (asset) { return stats.assets.find(function (obj) { return obj.name === asset; }).size; });
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
    /* PRINT */
    SummaryPlugin.prototype.printTemplates = function (tokens) {
        var hasEntryToken = this.template.includes('{entry.');
        if (!hasEntryToken)
            return this.printTemplate(tokens);
        for (var _i = 0, _a = tokens.entries; _i < _a.length; _i++) {
            var entry = _a[_i];
            var entryTokens = _.extend({}, tokens, { entry: entry });
            this.printTemplate(entryTokens);
        }
    };
    SummaryPlugin.prototype.printTemplate = function (tokens) {
        var summary = this.template, placeholders = string_matches_1.default(summary, /{[a-zA-Z0-9\._]+}/g).map(_.first);
        for (var _i = 0, placeholders_1 = placeholders; _i < placeholders_1.length; _i++) {
            var placeholder = placeholders_1[_i];
            var accessor = placeholder.slice(1, -1), value = String(_.get(tokens, accessor));
            summary = string_replace_all_1.default(summary, placeholder, value);
        }
        console.log(summary);
    };
    return SummaryPlugin;
}());
/* EXPORT */
exports.default = SummaryPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsWUFBWTs7O0FBRVosMEJBQTRCO0FBQzVCLGlEQUErRDtBQUMvRCxpREFBeUM7QUFDekMseURBQTRDO0FBRTVDLHFCQUFxQjtBQUVyQjtJQVFFLGlCQUFpQjtJQUVqQix1QkFBYyxRQUFpRztRQUFqRyx5QkFBQSxFQUFBLDJGQUFpRztRQUU3RyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUUzQixDQUFDO0lBRUQsYUFBYTtJQUViLDZCQUFLLEdBQUwsVUFBUSxRQUFRO1FBRWQsUUFBUSxDQUFDLE1BQU0sQ0FBRyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUcsSUFBSSxDQUFFLENBQUUsQ0FBQztRQUM5RCxRQUFRLENBQUMsTUFBTSxDQUFHLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBRyxJQUFJLENBQUUsQ0FBRSxDQUFDO0lBRXZELENBQUM7SUFFRCwrQkFBTyxHQUFQO1FBRUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFHLENBQUM7SUFFN0IsQ0FBQztJQUVELDZCQUFLLEdBQUwsVUFBUSxXQUFXLEVBQUUsSUFBSTtRQUV2QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUcsQ0FBQztRQUV6QixJQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFHLENBQUMsTUFBTSxFQUFHLEVBQ3pDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFHLEtBQUssQ0FBRSxDQUFDO1FBRXhDLElBQUksQ0FBQyxjQUFjLENBQUcsTUFBTSxDQUFFLENBQUM7UUFFL0IsSUFBSSxFQUFHLENBQUM7SUFFVixDQUFDO0lBRUQsWUFBWTtJQUVaLHFDQUFhLEdBQWIsVUFBZ0IsWUFBb0I7UUFFbEMsTUFBTSxDQUFDO1lB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