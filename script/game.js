"use strict";

var Game = function(elem, modelPath) {
  var self = this;
  var $elem = $(elem);
  // キャラクタ
  this.chara = null;
  // 画面
  this.screen = {
    width: $elem.width(),
    height: $elem.height()
  };

  // シーン
  this.scene = new THREE.Scene();

  // カメラ
  this.camera = new THREE.PerspectiveCamera(45, this.screen.width / this.screen.height, 1, 1000);
  this.camera.position.set(10, 5, 5);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  this.scene.add(this.camera);

  // ライト
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);　　
  directionalLight.position.set(0, 60, -200);　　
  var ambientLight = new THREE.AmbientLight(0xffffff);　　
  this.scene.add(directionalLight, ambientLight);

  // レンダラー
  this.renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  this.renderer.setSize(this.screen.width, this.screen.height);
  this.renderer.setClearColor(0xffffff, 0);
  $elem.append(this.renderer.domElement);

  // モデルローダー
  var loader = new THREE.JSONLoader();
  loader.load(modelPath, function(get, mat) {
    self.loadChara(get, mat);
  });

  this.rendering();
}

Game.prototype = {
  // レンダリングループ
  rendering: function() {
    this.renderer.render(this.scene, this.camera);

    var self = this;
    requestAnimationFrame(function() { self.rendering(); }, this.renderer.domElement);
  },
  // ロードする
  loadChara: function(geo, mat) {
    var material = new THREE.MultiMaterial(mat);
    this.chara = new THREE.SkinnedMesh(geo, material);
    this.scene.add(this.chara);
    console.log(this.chara);
  },

  changeFaceOffset: function(x, y) {
    var texture = this.chara.material.materials[1].map;
    var uvOffset = texture.offset;
    uvOffset.x = x;
    uvOffset.y = y;
  }
};
