<script>
	/*goToHome() {
    	this.menuService.navigateHome();
	  }*/
	let notificacion  =
	{
		no_vistos: 0
	};
</script>

<style>
	@import url("https://pruebasassets.portaloas.udistrital.edu.co/logo-header.css");
	.header-logo {
		display: none;
		border: none;
		box-shadow: none;
		background: url(https://pruebasassets.portaloas.udistrital.edu.co/isotipos-75x75.png);
		margin: 10px;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	.menu-app-info {
		border: none;
	}

	i {
		color: var(--primary);
	}

	.header-container {
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		z-index: 3;
		background-color: white;
		flex-shrink: 0;
		align-items: center;
		justify-content: space-between;
		margin-top: 0px;
		padding-left: 10px;
		box-shadow: 0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1);
	}

	.header-logo-container {
		padding: 5px 0 5px 0;
		display: flex;
		align-items: center;
	}

	.header-buttons-container {
		width: 50%;
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		align-items: center;
	}

	.header-button-notification {
		font-size: 25px;
		font-family: "Lucida Sans";
		padding: 8px 15px;
		width: 70px;
		height: 50px;
		cursor: pointer;
		color: var(--primary);
	}

	.header-button-user-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.header-button-user-container > p {
		margin: 8px;
		color: var(--primary);
	}

	.header-button-cerrarsesion-container > p {
		color: var(--primary);
	}

	#header-button-cerrarsesion-container {
		position: absolute;
		top: 60px;
		right: 10px;
		z-index: 10;
		display: none;
		border-radius: 15px;
		background-color: #fff;
		box-shadow: 0px 0px 9px -2px rgba(0, 0, 0, 0.84);
		width: 118px;
		height: 23px;
		text-align: center;
	}

	#header-user-icon {
		font-size: 25px;
		width: 36px;
	}

	.header-badge {
		position: relative;
		top: -45px;
		right: -22px;
		font-size: 0.7em;
		background: var(--primary);
		color: white;
		width: 25px;
		height: 25px;
		text-align: center;
		line-height: 25px;
		border-radius: 50%;
	}

	@media screen and (max-width: 855px) {
		.user-info {
			display: none;
		}
		.button-header {
			font-size: 20px;
		}

		.header-button-user-container {
			width: 70px;
		}

		.header-logo-container {
			display: flex;
			align-items: left;
			justify-content: left;
		}
	}

	@media screen and (max-width: 425px) {
		.user-info {
			display: none;
		}
		.button-header {
			font-size: 20px;
		}

		.header-buttons-container {
			width: 70%;
		}
	}
</style>

<svelte:options tag="svelte-header" />
<svelte:head>
	<link
		href="https://pruebasassets.portaloas.udistrital.edu.co/logo-header.css"
		rel="stylesheet" />
</svelte:head>

<main>
	<div class="header-container">
		<div class="logo-containter">
			<!--a (click)="toggleSidebar()" href="#" class="navigation">
			  <i class="nb-menu"></i>
			</a-->
			<div class="logo-header" id="core-header" />
		</div>
	</div>
	<div class="header-buttons-container">
        <div class="header-button-apps-container" onclick="toogleAplicaciones()">
            <i id="header-user-icon" class="fa fa-th-large"></i>
        </div>
        <div class="header-button-notification" onclick="togglenotify()">
            <i class="fa fa-bell-o"></i>
            <div class="header-badge">
                {notificacion.no_vistos}
            </div>
        </div>
        <div class="header-button-user-container" onclick="toogleCerrarSesion()" ng-show="token_service.live_token()">
            <i id="header-user-icon" class="fa fa-user-o"></i>
            <p class="user-info">token.sub</p>
            <i class="fa fa-chevron-down"></i>
            <div id="header-button-cerrarsesion-container" onclick='logout()'>
                <p>cerrar sesion</p>
            </div>
        </div>
    </div>
</main>
