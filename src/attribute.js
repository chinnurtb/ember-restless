/**
 * Attributes
 * Model property definitions
 */

// Standard attribute
RESTless.attr = function(type, opts) {
  var meta = Ember.merge({ type: type, isAttribute: true }, opts);
  return makeComputedAttribute(meta);
};

// belongsTo: One-to-one relationships
RESTless.belongsTo = function(type, opts) {
  var meta = Ember.merge({ type: type, isRelationship: true, belongsTo: true }, opts);
  return makeComputedAttribute(meta);
};

// hasMany: One-to-many & many-to-many relationships
RESTless.hasMany = function(type, opts) {
  var defaultArray = function() {
    return RESTless.RecordArray.createWithContent();
  },
  meta = Ember.merge({ type: type, isRelationship: true, hasMany: true, defaultValue: defaultArray }, opts);
  return makeComputedAttribute(meta);
};

function makeComputedAttribute(meta) {
  return Ember.computed(function(key, value) {
    var data = this.get('_data');
    // Getter
    if (arguments.length === 1) {
      value = data[key];

      if (value === undefined) { 
        // Default values
        if (typeof meta.defaultValue === 'function') {
          value = meta.defaultValue();
        } else {
          value = meta.defaultValue;
        }
        data[key] = value;
      }
    }
    // Setter 
    else if (value !== data[key]) {
      data[key] = value;
      if (!meta.readOnly && !RESTless.ReadOnlyModel.detectInstance(this)) {
        this._onPropertyChange(key);
      }
    }
    return value;
  }).property('_data').meta(meta);
}
