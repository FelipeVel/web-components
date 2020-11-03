<svelte:options tag="svelte-footer"></svelte:options>
<script>
	 let social = {
		list: [
			{
				title: "Horario ",
				//class: "time",
				class: "access_time",
				value: ["Lunes a viernes", "8am a 5pm"],
			},
			{
				title: "Nombre",
				//class: "globe",
				class: "language",
				value: [
					"Sistema Integrado de informática y  Telecomunicaciones ",
				],
			},
			{
				title: "Phone",
				class: "call",
				value: ["323 93 00", "Ext. 1112"],
			},
			{
				title: "Direccion",
				//class: "pin",
				class: "place",
				value: ["Cra 8 # 40-78", "Piso 1"],
			},
			{
				title: "mail",
				//class: "at",
				class: "alternate_email",
				value: ["computo@udistrital.edu.co"],
			},
		],
	};
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/icon?family=Material+Icons"
		rel="stylesheet" />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
		rel="stylesheet" />
</svelte:head>

<main>
	<div class="footer-div">
		
		<figure class="card-imageContainer">
			<img
				src="https://pruebasassets.portaloas.udistrital.edu.co/logo_universidad_acreditacion_inverse.png"
				class="card-image"
				alt="logo-udistrital" />
		</figure>
		<div class="footer-column">
			<div class="footer-title">
				<h5>Oficina Asesora de Sistemas</h5>
			</div>
		</div>

		<div class="footer-logos">
			
			{#each social.list as lista}
				<div class="social">
					<span class="material-icons">
						{lista.class}
					</span>
					<div class="text-container">
						{#each lista.value as value}
							<p>{value}</p>
						{/each}	
					</div>
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	@import url("https://pruebasassets.portaloas.udistrital.edu.co/font-style.css");
	.footer-div {
		background-color: #2b3643;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1%;
		box-shadow: 2px -2px 11px #888888;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.card-imageContainer {
		object-fit: cover;
		margin: 0;
		border-right: 0.1rem solid white;
		align-self: center;
	}
	.text-container {
		align-self: center;
	}
	.card-image {
		width: 230px;
	}

	.footer-column {
		color: white;
		width: 10%;
		margin-top: 1%;
		align-self: center;
		margin-right: 3%;
	}

	.footer-title {
		text-align: center;
	}
	h3,
	h5 {
		font-family: "Open Sans" !important;
		margin-bottom: 0.5rem;
		font-size: 1rem;
		font-family: Exo;
		margin-top: 0;
		color: white;
	}

	.footer-logos {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 65%;
	}
	.social {
		display: flex;
		padding-left: 5px;
		padding-right: 5px;
		color: white;
		justify-content: center;
		width: 18%;
		align-self: center;
	}
	.icon-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.material-icons {
		font-size: 32px;
		align-self: center;
		margin-right: 10px;
	}
	p {
		font-size: 13px;
		text-align: center;
		margin: 0;
		font-family: "Open Sans";
	}

	@media screen and (max-width: 1132px) {
		.social {
			width: 20%;
		}
		p {
			font-size: 13px;
		}
		.footer-column {
			margin-right: 0;
		}
	}

	@media screen and (max-width: 930px) {
		.social {
			width: 30%;
		}
		.footer-logos {
			width: 50%;
		}
	}

	@media screen and (max-width: 768px) {
		.social {
			width: 40%;
		}
	}

	@media screen and (max-width: 620px) {
		.social {
			width: 40%;
		}
		.footer-logos {
			width: 100%;
		}
		.footer-column {
			width: 30%;
		}
	}

	@media screen and (max-width: 330px) {
		.card-image {
			width: 200px;
		}
		h5 {
			font-size: 15px;
		}
	}
</style>

