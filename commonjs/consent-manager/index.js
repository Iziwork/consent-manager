"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var consent_manager_builder_1 = __importDefault(require("../consent-manager-builder"));
var container_1 = __importDefault(require("./container"));
var categories_1 = require("./categories");
var zeroValuePreferences = {
    marketingAndAnalytics: null,
    advertising: null,
    functional: null
};
var ConsentManager = /** @class */ (function (_super) {
    __extends(ConsentManager, _super);
    function ConsentManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getInitialPreferences = function () {
            var _a = _this.props, initialPreferences = _a.initialPreferences, customCategories = _a.customCategories;
            if (initialPreferences) {
                return initialPreferences;
            }
            if (!customCategories) {
                return zeroValuePreferences;
            }
            var initialCustomPreferences = {};
            Object.keys(customCategories).forEach(function (category) {
                initialCustomPreferences[category] = null;
            });
            return initialCustomPreferences;
        };
        _this.handleMapCustomPreferences = function (destinations, preferences) {
            var customCategories = _this.props.customCategories;
            var destinationPreferences = {};
            var customPreferences = {};
            if (customCategories) {
                for (var _i = 0, _a = Object.keys(customCategories); _i < _a.length; _i++) {
                    var preferenceName = _a[_i];
                    var value = preferences[preferenceName];
                    if (typeof value === 'boolean') {
                        customPreferences[preferenceName] = value;
                    }
                    else {
                        customPreferences[preferenceName] = true;
                    }
                }
                destinations.forEach(function (destination) {
                    // Mark custom categories 
                    Object.entries(customCategories).forEach(function (_a) {
                        var categoryName = _a[0], integrations = _a[1].integrations;
                        var consentAlreadySetToFalse = destinationPreferences[destination.id] === false;
                        var shouldSetConsent = integrations.includes(destination.id);
                        if (shouldSetConsent && !consentAlreadySetToFalse) {
                            destinationPreferences[destination.id] = customPreferences[categoryName];
                        }
                    });
                });
                return { destinationPreferences: destinationPreferences, customPreferences: customPreferences };
            }
            // Default unset preferences to true (for implicit consent)
            for (var _b = 0, _c = Object.keys(preferences); _b < _c.length; _b++) {
                var preferenceName = _c[_b];
                var value = preferences[preferenceName];
                if (typeof value === 'boolean') {
                    customPreferences[preferenceName] = value;
                }
                else {
                    customPreferences[preferenceName] = true;
                }
            }
            var customPrefs = customPreferences;
            var _loop_1 = function (destination) {
                // Mark advertising destinations
                if (categories_1.ADVERTISING_CATEGORIES.find(function (c) { return c === destination.category; }) && destinationPreferences[destination.id] !== false) {
                    destinationPreferences[destination.id] = customPrefs.advertising;
                }
                // Mark function destinations
                if (categories_1.FUNCTIONAL_CATEGORIES.find(function (c) { return c === destination.category; }) && destinationPreferences[destination.id] !== false) {
                    destinationPreferences[destination.id] = customPrefs.functional;
                }
                // Fallback to marketing
                if (!(destination.id in destinationPreferences)) {
                    destinationPreferences[destination.id] = customPrefs.marketingAndAnalytics;
                }
            };
            for (var _d = 0, destinations_1 = destinations; _d < destinations_1.length; _d++) {
                var destination = destinations_1[_d];
                _loop_1(destination);
            }
            return { destinationPreferences: destinationPreferences, customPreferences: customPreferences };
        };
        return _this;
    }
    ConsentManager.prototype.render = function () {
        var _this = this;
        var _a = this.props, writeKey = _a.writeKey, otherWriteKeys = _a.otherWriteKeys, shouldRequireConsent = _a.shouldRequireConsent, implyConsentOnInteraction = _a.implyConsentOnInteraction, cookieDomain = _a.cookieDomain, bannerContent = _a.bannerContent, bannerSubContent = _a.bannerSubContent, bannerTextColor = _a.bannerTextColor, bannerBackgroundColor = _a.bannerBackgroundColor, preferencesDialogTitle = _a.preferencesDialogTitle, preferencesDialogContent = _a.preferencesDialogContent, cancelDialogTitle = _a.cancelDialogTitle, cancelDialogContent = _a.cancelDialogContent, customCategories = _a.customCategories, onError = _a.onError;
        return (react_1.default.createElement(consent_manager_builder_1.default, { onError: onError, writeKey: writeKey, otherWriteKeys: otherWriteKeys, shouldRequireConsent: shouldRequireConsent, cookieDomain: cookieDomain, initialPreferences: this.getInitialPreferences(), mapCustomPreferences: this.handleMapCustomPreferences, customCategories: customCategories }, function (_a) {
            var destinations = _a.destinations, customCategories = _a.customCategories, newDestinations = _a.newDestinations, preferences = _a.preferences, isConsentRequired = _a.isConsentRequired, setPreferences = _a.setPreferences, resetPreferences = _a.resetPreferences, saveConsent = _a.saveConsent;
            return react_1.default.createElement(container_1.default, { customCategories: customCategories, destinations: destinations, newDestinations: newDestinations, preferences: preferences, isConsentRequired: isConsentRequired, setPreferences: setPreferences, resetPreferences: resetPreferences, saveConsent: saveConsent, closeBehavior: _this.props.closeBehavior, implyConsentOnInteraction: implyConsentOnInteraction !== null && implyConsentOnInteraction !== void 0 ? implyConsentOnInteraction : ConsentManager.defaultProps.implyConsentOnInteraction, bannerContent: bannerContent, bannerSubContent: bannerSubContent, bannerTextColor: bannerTextColor || ConsentManager.defaultProps.bannerTextColor, bannerBackgroundColor: bannerBackgroundColor || ConsentManager.defaultProps.bannerBackgroundColor, preferencesDialogTitle: preferencesDialogTitle, preferencesDialogContent: preferencesDialogContent, cancelDialogTitle: cancelDialogTitle, cancelDialogContent: cancelDialogContent });
        }));
    };
    ConsentManager.displayName = 'ConsentManager';
    ConsentManager.defaultProps = {
        otherWriteKeys: [],
        shouldRequireConsent: function () { return true; },
        implyConsentOnInteraction: false,
        onError: undefined,
        cookieDomain: undefined,
        customCategories: undefined,
        bannerTextColor: '#fff',
        bannerSubContent: 'You can change your preferences at any time.',
        bannerBackgroundColor: '#1f4160',
        preferencesDialogTitle: 'Website Data Collection Preferences',
        cancelDialogTitle: 'Are you sure you want to cancel?'
    };
    return ConsentManager;
}(react_1.PureComponent));
exports.default = ConsentManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc2VudC1tYW5hZ2VyL2luZGV4LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTRDO0FBQzVDLHVGQUE4RDtBQUM5RCwwREFBbUM7QUFDbkMsMkNBQTRFO0FBRzVFLElBQU0sb0JBQW9CLEdBQXdCO0lBQ2hELHFCQUFxQixFQUFFLElBQUk7SUFDM0IsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLElBQUk7Q0FDakIsQ0FBQTtBQUVEO0lBQTRDLGtDQUFzQztJQUFsRjtRQUFBLHFFQWtLQztRQTlFQywyQkFBcUIsR0FBRztZQUNoQixJQUFBLGdCQUFxRCxFQUFuRCwwQ0FBa0IsRUFBRSxzQ0FBK0IsQ0FBQTtZQUMzRCxJQUFJLGtCQUFrQixFQUFFO2dCQUN0QixPQUFPLGtCQUFrQixDQUFBO2FBQzFCO1lBRUQsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUNyQixPQUFPLG9CQUFvQixDQUFBO2FBQzVCO1lBRUQsSUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUE7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7Z0JBQzVDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQTtZQUMzQyxDQUFDLENBQUMsQ0FBQTtZQUVGLE9BQU8sd0JBQXdCLENBQUE7UUFDakMsQ0FBQyxDQUFBO1FBRUQsZ0NBQTBCLEdBQUcsVUFBQyxZQUEyQixFQUFFLFdBQWdDO1lBQ2pGLElBQUEsK0NBQWdCLENBQWU7WUFDdkMsSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUE7WUFDakMsSUFBTSxpQkFBaUIsR0FBRyxFQUFFLENBQUE7WUFFNUIsSUFBSSxnQkFBZ0IsRUFBRTtnQkFDcEIsS0FBNkIsVUFBNkIsRUFBN0IsS0FBQSxNQUFNLENBQUMsSUFB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