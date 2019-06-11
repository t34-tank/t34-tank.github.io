GeoPortal.Widget.ListFeature = GeoPortal.Widget.extend({
	
	options: {
		application: null
	},
	
    _createWidget: function(){

		this._feature = this.options.feature;
		this._layerId = this.options.layerId;
		
		this._elemBlock = $('<a class="region__photo-block gallery-block" href="#"/>').appendTo(this._mainElement);
		this._elemBlock.append('<img src="img/region-page/ajax-loader.gif" alt="" class="ajax-loader"/>');
		
		this._loadEisFiles();
		
		this._bind(this._elemBlock,"click",{me:this},function(event){
			var me = event.data.me;
			me.fire("feature:click",{feature: me._feature});
		
		});
		
	},
	
	_loadEisFiles: function(){
        this._loadEis = true;
        this._firstEisElem = null;

        this.on("eisLoaded",this._showEisFile,this);
        apiJsonGET(GeoPortal.basePath + "/layers/eis/"+this._layerId+"/"+this._feature.fid+"?random="+Math.random(),{},M.Util.bind(function(data){

            if(data && data.files && data.files.length) {
				this._feature.eisStore = data.files;
				GeoPortal.fire("features:store:updated");
                
				var i,len = data.files.length;
                for(i=0;i<len;i++){
                    var file = data.files[i];
                    if(file.type.name == 'photo' && this._firstEisElem == null){
                        this._firstEisElem = {
                            type: 'photo',
                            file: file
                        };
                    }
                }
            } 
			this.fire("eisLoaded");

        },this));
    },

    _showEisFile: function(){
		this.off("eisLoaded",this._showEisFile,this);
		
		if(this._firstEisElem != undefined) {
		
			var eisFile = this._firstEisElem.file,
				url = eisFile.url;
				
				var shortUrl = url+'/117/166';
					
				if(url.startsWith("/")) {
					var token = GeoPortal._accessToken != null ? GeoPortal._accessToken : "";
					shortUrl = GeoPortal.basePath + shortUrl+ "?token=" + token;
				} 
				
				var image = $('<img src="'+shortUrl+'" alt="" class="gallery-block__img"/>').appendTo(this._elemBlock);
				this._elemBlock.append('<div class="gallery-block__name">'+this._feature.title+'</div>');
				
                this._bind(image,"load",{me:this},function(event){
					var me = event.data.me;
					me._elemBlock.find(".ajax-loader").remove();
                
				});
		} else {
			this._elemBlock.find(".ajax-loader").remove();
			this._elemBlock.append('<img src="img/region-page/Image_15.jpg" alt="" class="gallery-block__img"/>')
			this._elemBlock.append('<div class="gallery-block__name">'+this._feature.title+'</div>');
		}
			
        
    }


});