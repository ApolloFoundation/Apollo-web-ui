String.prototype.replaceAll = function(search, replace){
    return this.split(search).join(replace);
  }