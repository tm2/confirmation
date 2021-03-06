/**
 * Module dependencies.
 */

var Dialog = require('dialog').Dialog
  , html = require('./confirmation')
  , inherit = require('inherit')
  , $ = require('jquery')

/**
 * Expose `confirm()`.
 */

exports = module.exports = confirm;

/**
 * Expose `Confirmation`.
 */

exports.Confirmation = Confirmation;

/**
 * Return a new `Confirmation` with the given 
 * (optional) `title` and `msg`.
 *
 * @param {String} title or msg
 * @param {String} msg
 * @return {Confirmation}
 * @api public
 */

function confirm(title, msg) {
  switch (arguments.length) {
    case 2:
      return new Confirmation({ title: title, message: msg });
    case 1:
      return new Confirmation({ message: title });
  }
}

/**
 * Initialize a new `Confirmation` dialog.
 *
 * @param {Object} options
 * @api public
 */

function Confirmation(options) {
  Dialog.call(this, options);
  this.focus('cancel');
};

/**
 * Inherits from `Dialog.prototype`.
 */

inherit(Confirmation, Dialog);

/**
 * Focus `type`, either "ok" or "cancel".
 *
 * @param {String} type
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.focus = function(type){
  this._focus = type;
  return this;
};

/**
 * Change "cancel" button `text`.
 *
 * @param {String} text
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.cancel = function(text){
  var $el = $(this.el);
  $el.find('.cancel').text(text);
  return this;
};

/**
 * Change "ok" button `text`.
 *
 * @param {String} text
 * @return {Confirmation}
 * @api public
 */

Confirmation.prototype.ok = function(text){
  var $el = $(this.el);
  $el.find('.ok').text(text);
  return this;
};

/**
 * Show the confirmation dialog and invoke `fn(ok)`.
 *
 * @param {Function} fn
 * @return {Confirmation} for chaining
 * @api public
 */

Confirmation.prototype.show = function(fn){
  Dialog.prototype.show.call(this);
  Backbone.Events.trigger("window:keypress:context", "dialog");
  this.el.style.marginLeft = -(this.el.offsetWidth / 2) + 'px'
  var $el = $(this.el);
  $el.find('.' + this._focus).focus();
  this.callback = fn || function(){};
  return this;
};

/**
 * Render with the given `options`.
 *
 * Emits "cancel" event.
 * Emits "ok" event.
 *
 * @param {Object} options
 * @api public
 */

Confirmation.prototype.render = function(options){
  var self = this
  var actions = $(html);
  Dialog.prototype.render.call(this, options);
  var $el = $(this.el);
  $el.addClass('confirmation');
  $el.append(actions);

  this.on('close', function(){
    self.emit('cancel');
    Backbone.Events.trigger("dialog:close");
    self.callback(false);
  });

  this.on('escape', function(){
    self.emit('cancel');
    Backbone.Events.trigger("dialog:close");
    self.callback(false);
  });

  actions.find('.cancel').click(function(e){
    e.preventDefault();
    self.emit('cancel');
    Backbone.Events.trigger("dialog:close");
    self.callback(false);
    self.hide();
  });

  actions.find('.ok').click(function(e){
    e.preventDefault();
    self.emit('ok');
    Backbone.Events.trigger("dialog:close");
    self.callback(true);
    self.hide();
  });
};
