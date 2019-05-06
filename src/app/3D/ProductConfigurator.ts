import { WebGLRenderer, Scene, PerspectiveCamera, HemisphereLight,
  Mesh, Color, BoxGeometry, MeshLambertMaterial,  } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ProductConfiguratorService } from "../product-configurator.service";
import { MeshLoader } from "./MeshLoader";
import { ProductChanger } from "./ProductChanger";

export class ProductConfigurator {
  public productConfigurationService: ProductConfiguratorService;

  public renderer: WebGLRenderer;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public cameraControls: OrbitControls;

  private productChanger: ProductChanger;

  constructor(renderer: WebGLRenderer, productConfigurationService: ProductConfiguratorService) {
    this.renderer = renderer;
    this.productConfigurationService = productConfigurationService;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new Color(0x444444) );

    this.scene = new Scene();

    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(90, aspectRatio, 0.1, 10000);
    this.camera.position.z = 100;

    this.scene.add(this.camera);

    this.cameraControls = new OrbitControls( this.camera, this.renderer.domElement );
    this.cameraControls.maxPolarAngle = Math.PI;
    this.cameraControls.minPolarAngle = 0;
    this.cameraControls.enablePan = false;
    this.cameraControls.update();

    const light = new HemisphereLight(0xFFFFFF, 0x000000);
    this.scene.add(light);

    this.productChanger = new ProductChanger(this);

    this.productChanger.changeProduct(this.productConfigurationService.items[0]);

    this.initEvents();

    this.startRenderLoop();
  }

  public startRenderLoop() {
    const renderFunction = () => {
      this.cameraControls.update();

      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(renderFunction);
    };

    requestAnimationFrame(renderFunction);
  }

  /**
   * Init events like window.resize
   */
  public initEvents() {
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    this.productConfigurationService.toolbarChangeProductSubject.subscribe({
      next: (value: any) => this.changeMesh(value)
    });
  }

  public changeMesh(value: any) {

  }
}

export default ProductConfigurator;
